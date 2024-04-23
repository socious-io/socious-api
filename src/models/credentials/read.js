import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering } from '../../utils/query.js'

export const experienceFilters = {
  status: String
}

export const getOrgVerificationRequest = (id) => {
  return app.db.get(sql`
      SELECT vc.id,
      vc.identity_id,
      vc.status,
      vc.created_at,
      vc.updated_at,
      jsonb_agg(
        json_build_object(
          'id', m.id, 
          'url', m.url, 
          'filename', m.filename,
          'created_at', m.created_at
        )
      ) AS documents
        FROM verification_credentials vc
          JOIN verification_documents vd on vd.verification_id = vc.id
          JOIN media m ON m.id = vd.media_id
        WHERE vc.identity_id = ${id}
      GROUP BY vc.id
    `)
}

export const getRequestVerificationByIdentity = async (identityId) => {
  return app.db.get(sql`
    SELECT 
    vc.*,
    row_to_json(i.*) AS identity
    FROM verification_credentials vc
    JOIN identities i ON i.id=vc.identity_id
    WHERE vc.identity_id=${identityId}
  `)
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
        body->>'document_number' = ${body.document_number} AND
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

export const getCredentialByExperienceId = async (experienceId) => {
  return app.db.get(sql`
  SELECT 
    row_to_json(c.*) AS experience_credentials,
    row_to_json(e.*) AS experience
  FROM experiences e
    JOIN experience_credentials c ON e.id=c.experience_id
  WHERE e.id=${experienceId}
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

export const getRequestEducation = async (id) => {
  return app.db.get(sql`
  SELECT 
    c.*,
    row_to_json(e.*) AS education,
    row_to_json(u.*) AS user,
    row_to_json(o.*) AS org,
    row_to_json(m.*) AS avatar
  FROM educations_credentials c
    JOIN educations e ON e.id=c.education_id
    JOIN users u ON u.id=c.user_id
    JOIN organizations o ON o.id=c.org_id
    LEFT JOIN media m ON m.id=u.avatar
    WHERE c.id=${id}
  `)
}

export const getCredentialByEducationId = async (id) => {
  return app.db.get(sql`
  SELECT 
    row_to_json(c.*) AS educations_credentials,
    row_to_json(e.*) AS education
  FROM experiences e
    JOIN educations_credentials c ON e.id=c.education_id
  WHERE e.id=${id}
  `)
}

export const getRequestEducationbyConnection = async (connectId) => {
  return app.db.get(sql`
    SELECT 
    c.*,
    row_to_json(e.*) AS education,
    row_to_json(u.*) AS user,
    row_to_json(o.*) AS org,
    row_to_json(m.*) AS avatar
    FROM educations_credentials c
    JOIN educations e ON e.id=c.education_id
    JOIN users u ON u.id=c.user_id
    JOIN organizations o ON o.id=c.org_id
    LEFT JOIN media m ON m.id=u.avatar
    WHERE c.connection_id=${connectId}
  `)
}

export const requestedEducations = async (identityId, { limit = 10, offset = 0, filter }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(c.*) OVER () as total_count,
      c.*,
      row_to_json(e.*) AS education,
      row_to_json(u.*) AS user,
      row_to_json(o.*) AS org,
      row_to_json(m.*) AS avatar,
      row_to_json(mo.*) AS org_image
    FROM educations_credentials c
      JOIN educations e ON e.id=c.education_id
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
