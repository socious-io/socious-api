import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering, textSearch, sorting } from '../../utils/query.js'

export const filterColumns = {
  country: String,
  type: String,
  social_causes: Array
}

export const sortColumns = ['created_at', 'updated_at']

export const all = async ({ offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, 
    org.*,
    array_to_json(org.social_causes) AS social_causes,
    row_to_json(m_image.*) AS image,
    row_to_json(m_cover.*) AS cover_image
    FROM organizations org
    LEFT JOIN media m_image ON m_image.id=org.image
    LEFT JOIN media m_cover ON m_cover.id=org.cover_image
    ${filtering(filter, filterColumns, false, 'org')}
    ${sorting(sort, sortColumns, 'org')}
    LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const get = async (id) => {
  return app.db.get(sql`
    SELECT org.*,
    array_to_json(org.social_causes) AS social_causes,
    row_to_json(m_image.*) AS image,
    row_to_json(m_cover.*) AS cover_image
    FROM organizations org
    LEFT JOIN media m_image ON m_image.id=org.image
    LEFT JOIN media m_cover ON m_cover.id=org.cover_image
    WHERE org.id=${id}`)
}

export const getAll = async (ids, sort) => {
  const { rows } = await app.db.query(sql`
    SELECT 
      org.*,
      array_to_json(org.social_causes) AS social_causes,
      row_to_json(m_image.*) AS image,
      row_to_json(m_cover.*) AS cover_image
    FROM organizations org
    LEFT JOIN media m_image ON m_image.id=org.image
    LEFT JOIN media m_cover ON m_cover.id=org.cover_image
    WHERE org.id=ANY(${ids})
    ${sorting(sort, sortColumns, 'org')}
    `)
  return rows
}

export const getByShortname = async (shortname) => {
  return app.db.get(sql`
    SELECT org.*,
    array_to_json(org.social_causes) AS social_causes,
    row_to_json(m_image.*) AS image,
    row_to_json(m_cover.*) AS cover_image
    FROM organizations org
    LEFT JOIN media m_image ON m_image.id=org.image
    LEFT JOIN media m_cover ON m_cover.id=org.cover_image
    WHERE org.shortname=${shortname.toLowerCase()}`)
}

export const shortNameExists = async (shortname) => {
  try {
    await app.db.get(sql`SELECT * FROM organizations WHERE shortname=${shortname.toLowerCase()}`)
    return true
  } catch {
    return false
  }
}

export const search = async (q, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(*) OVER () as total_count,
      org.id
    FROM organizations org
    WHERE
      org.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
    `)

  const orgs = await getAll(
    rows.map((r) => r.id),
    sort
  )

  return orgs.map((r) => {
    return {
      total_count: rows.length > 0 ? rows[0].total_count : 0,
      ...r
    }
  })
}
