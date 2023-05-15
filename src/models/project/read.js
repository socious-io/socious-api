import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { filtering, textSearch, sorting } from '../../utils/query.js'

export const filterColumns = {
  country: String,
  causes_tags: Array,
  skills: Array,
  payment_type: String,
  payment_scheme: String,
  status: String,
  identity_id: String,
  payment_currency: String,
  project_type: String,
  project_length: String,
  other_party_title: String,
  remote_preference: String
}

export const sortColumns = ['updated_at', 'created_at', 'title', 'payment_range_higher', 'payment_range_lower']

export const get = async (id, userId = undefined) => {
  return app.db.get(sql`
  SELECT p.*, i.type  as identity_type, i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags,
    row_to_json(j.*) AS job_category,
    (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants,
    EXISTS(SELECT id FROM applicants WHERE project_id=${id} AND user_id=${userId}) AS applied
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
    LEFT JOIN job_categories j ON j.id=p.job_category_id
  WHERE p.id=${id}
  `)
}

export const getAll = async (ids, sort) => {
  const { rows } = await app.db.query(sql`
  SELECT p.*,
    i.type  as identity_type,
    i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags,
    row_to_json(j.*) AS job_category,
    (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
    LEFT JOIN job_categories j ON j.id=p.job_category_id
  WHERE p.id=ANY(${ids})
  ${sorting(sort, sortColumns, 'p')}
  `)
  return rows
}

export const all = async ({ offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      array_to_json(p.causes_tags) AS causes_tags,
      i.type  as identity_type, i.meta as identity_meta,
      row_to_json(j.*) AS job_category,
      (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      LEFT JOIN job_categories j ON j.id=p.job_category_id
      ${filtering(filter, filterColumns, false, 'p')}
      ${sorting(sort, sortColumns, 'p')}
      LIMIT ${limit} OFFSET ${offset}`)
  return rows
}

export const permissioned = async (identityId, id) => {
  const project = await get(id)
  if (project.identity_id !== identityId) {
    throw new PermissionError('Not allow')
  }
  return project
}

export const search = async (q, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(*) OVER () as total_count,
      p.id
    FROM projects p
    WHERE
      p.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
  `)

  const projects = await getAll(
    rows.map((r) => r.id),
    sort
  )

  return projects.map((r) => {
    return {
      total_count: rows.length > 0 ? rows[0].total_count : 0,
      ...r
    }
  })
}

export const jobCategories = async () => {
  const { rows } = await app.db.query(sql`SELECT * FROM job_categories`)
  return rows
}

export const jobCategory = async (id) => {
  return app.db.get(sql`SELECT * FROM job_categories WHERE id=${id}`)
}
