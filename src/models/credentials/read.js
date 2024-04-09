import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering } from '../../utils/query.js'

export const experienceFilters = {
  status: String
}

export const getRequestVerification = async (id) => {
  return app.db.get(sql`
    SELECT 
    vc.*,
    row_to_json(i.*) AS identity
    FROM verification_credentials vc
    JOIN identities i ON i.id=vc.identity_id
    WHERE vc.id=${id}
  `)
}

export const getRequestVerificationByConnection = async (connectionId) => {
  return app.db.get(sql`
    SELECT 
    vc.*,
    row_to_json(i.*) AS identity
    FROM verification_credentials vc
    JOIN identities i ON i.id=vc.identity_id
    WHERE vc.connection_id=${connectionId}
  `)
}

export const searchSimilarVerification = async (body) => {
  const { rows } = await app.db.query(sql`
    SELECT * FROM verification_credentials
    WHERE 
      (
        body->>'document_number' = ${body.document_number}
        body->>'country' = ${body.country}
      ) OR 
      (
        body->>'first_name' = ${body.first_name} AND 
        body->>'last_name' = ${body.last_name} AND 
        body->>'date_of_birth' = ${body.date_of_birth}
      );
  `)
  return rows
}

export const getRequestExperience = async (id) => {
  return app.db.get(sql`
  SELECT 
    c.*,
    row_to_json(e.*) AS experience,
    row_to_json(u.*) AS user,
    row_to_json(o.*) AS org,
    row_to_json(j.*) AS job_category,
    row_to_json(m.*) AS avatar
  FROM experience_credentials c
    JOIN experiences e ON e.id=c.experience_id
    JOIN users u ON u.id=c.user_id
    JOIN organizations o ON o.id=c.org_id
    LEFT JOIN job_categories j ON j.id=e.job_category_id
    LEFT JOIN media m ON m.id=u.avatar
    WHERE c.id=${id}
  `)
}

export const getRequestExperiencebyConnection = async (connectId) => {
  return app.db.get(sql`
    SELECT 
    c.*,
    row_to_json(e.*) AS experience,
    row_to_json(u.*) AS user,
    row_to_json(o.*) AS org,
    row_to_json(j.*) AS job_category,
    row_to_json(m.*) AS avatar
    FROM experience_credentials c
    JOIN experiences e ON e.id=c.experience_id
    JOIN users u ON u.id=c.user_id
    JOIN organizations o ON o.id=c.org_id
    LEFT JOIN job_categories j ON j.id=e.job_category_id
    LEFT JOIN media m ON m.id=u.avatar
    WHERE c.connection_id=${connectId}
  `)
}

export const requestedExperiences = async (identityId, { limit = 10, offset = 0, filter }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(c.*) OVER () as total_count,
      c.*,
      row_to_json(e.*) AS experience,
      row_to_json(u.*) AS user,
      row_to_json(o.*) AS org,
      row_to_json(m.*) AS avatar,
      row_to_json(mo.*) AS org_image
    FROM experience_credentials c
      JOIN experiences e ON e.id=c.experience_id
      JOIN users u ON u.id=c.user_id
      JOIN organizations o ON o.id=c.org_id
      LEFT JOIN media m ON m.id=u.avatar
      LEFT JOIN media mo ON mo.id=o.image
    WHERE (c.org_id = ${identityId} OR c.user_id = ${identityId})
    ${filtering(filter, experienceFilters, true, 'c')}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}
