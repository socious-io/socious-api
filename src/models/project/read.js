import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { filtering, textSearch, sorting } from '../../utils/query.js'

export const filterColumns = {
  country: String,
  city: String,
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
  remote_preference: String,
  promoted: Boolean,
  experience_level: Number,
  job_category_id: String,
  kind: String,
  payment_range_lower: Number,
  payment_range_higher: Number,
  payment_mode: String
}

export const markingFilterColumns = {
  marked_as: String
}

export const sortColumns = [
  'promoted',
  'updated_at',
  'created_at',
  'title',
  'payment_range_higher',
  'payment_range_lower'
]

export const get = async (id, identityId) => {
  return app.db.get(sql`
  SELECT p.*, i.type  as identity_type, i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags,
    row_to_json(j.*) AS job_category,
    (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants,
    (SELECT COUNT(*) FROM missions a WHERE a.project_id=p.id)::int AS missions,
    CASE WHEN a.id IS NOT NULL THEN TRUE ELSE FALSE END AS applied,
    a.created_at AS applied_date,
    EXISTS(SELECT id FROM project_marks WHERE project_id=p.id AND marked_as='SAVE' AND identity_id=${identityId}) AS saved,
    EXISTS(SELECT id FROM project_marks WHERE project_id=p.id AND marked_as='NOT_INTERESTED' AND identity_id=${identityId}) AS not_interested
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
    LEFT JOIN applicants a ON a.project_id=${id} AND a.user_id=${identityId}
    LEFT JOIN job_categories j ON j.id=p.job_category_id
  WHERE p.id=${id} AND p.kind='JOB'
  `)
}

export const getAll = async (ids, identityId) => {
  const { rows } = await app.db.query(sql`
  SELECT p.*,
    i.type  as identity_type,
    i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags,
    row_to_json(j.*) AS job_category,
    (
      COALESCE(
        (SELECT
          jsonb_agg(
            json_build_object(
            'id', m.id,
            'url', m.url, 
            'filename', m.filename
            )
          )
        FROM media m
        LEFT JOIN service_work_samples sws ON sws.service_id=p.id
        WHERE m.id = sws.document
        ),
        '[]'
      )
    ) AS work_samples,
    (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants,
    (SELECT COUNT(*) FROM missions a WHERE a.project_id=p.id)::int AS missions,
    EXISTS(SELECT id FROM project_marks WHERE project_id=p.id AND marked_as='SAVE' AND identity_id=${identityId}) AS saved,
    EXISTS(SELECT id FROM project_marks WHERE project_id=p.id AND marked_as='NOT_INTERESTED' AND identity_id=${identityId}) AS not_interested
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
    LEFT JOIN job_categories j ON j.id=p.job_category_id
  WHERE p.id=ANY(${ids})
  ORDER BY array_position(${ids}, p.id)
  `)
  return rows
}

export const getAllWithMarksByIdentity = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      array_to_json(p.causes_tags) AS causes_tags,
      i.type  as identity_type, i.meta as identity_meta,
      row_to_json(j.*) AS job_category,
      (SELECT COUNT(*) FROM missions a WHERE a.project_id=p.id)::int AS missions,
      (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants,
      (CASE WHEN jm.marked_as='SAVE' THEN true ELSE false END) AS saved,
      (CASE WHEN jm.marked_as='NOT_INTERESTED' THEN true ELSE false END) AS not_interested
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      JOIN project_marks jm on jm.project_id=p.id AND jm.identity_id=${identityId}
      LEFT JOIN job_categories j ON j.id=p.job_category_id
      ${filtering(filter, markingFilterColumns, false, 'jm')}
      ${sorting(sort, sortColumns, 'p')}
      LIMIT ${limit} OFFSET ${offset}`)
  return rows //TODO: Add p.kind='JOB'
}

export const all = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  //Default job filter
  if (!filter) filter = { kind: 'JOB' }
  else if (filter && !filter.kind) filter = { ...filter, kind: 'JOB' }

  const { rows } = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      array_to_json(p.causes_tags) AS causes_tags,
      i.type  as identity_type, i.meta as identity_meta,
      row_to_json(j.*) AS job_category,
      (
        COALESCE(
          (SELECT
            jsonb_agg(
              json_build_object(
              'id', m.id,
              'url', m.url, 
              'filename', m.filename
              )
            )
          FROM media m
          LEFT JOIN service_work_samples sws ON sws.service_id=p.id
          WHERE m.id = sws.document
          ),
          '[]'
        )
      ) AS work_samples,
      (SELECT COUNT(*) FROM missions a WHERE a.project_id=p.id)::int AS missions,
      (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants,
      (jm.marked_as='SAVE') AS saved
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      LEFT JOIN job_categories j ON j.id=p.job_category_id
      LEFT JOIN project_marks jm on jm.project_id=p.id AND jm.identity_id=${identityId}
      WHERE (expires_at > NOW() OR expires_at IS NULL) AND (jm IS NULL OR jm.marked_as!='NOT_INTERESTED')
      ${filtering(filter, filterColumns, true, 'p')}
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
  //Default job filter
  if (!filter) filter = { kind: 'JOB' }
  else if (filter && !filter.kind) filter = { ...filter, kind: 'JOB' }

  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(*) OVER () as total_count,
      p.id
    FROM projects p
    WHERE
      p.search_tsv @@ to_tsquery(${textSearch(q)})
      AND status='ACTIVE'
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
  `)

  const projects = await getAll(rows.map((r) => r.id))

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
