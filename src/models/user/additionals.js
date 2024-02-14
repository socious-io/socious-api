import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering } from '../../utils/query.js'
import { EntryError } from '../../utils/errors.js'

export const addLanguage = async (user, { name, level }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO languages (name, level, user_id) 
    VALUES (${name}, ${level}, ${user.id})
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const editLanguage = async (id, user, { name, level }) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE languages SET 
    name=${name},
    level=${level}
    WHERE user_id=${user.id} AND id=${id}
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeLanguage = async (id, user) => {
  await app.db.query(sql`DELETE FROM languages WHERE id=${id} AND user_id=${user.id}`)
}

export const addExperience = async (
  user,
  { org_id, title, description, skills, start_at, end_at, city, country, employment_type, job_category_id }
) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO experiences (
      org_id,
      title,
      description,
      skills,
      start_at,
      end_at,
      user_id,
      city,
      country,
      employment_type,
      job_category_id
    ) 
    VALUES (
      ${org_id},
      ${title},
      ${description},
      ${skills},
      ${start_at},
      ${end_at},
      ${user.id},
      ${city},
      ${country},
      ${employment_type},
      ${job_category_id}
      )
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const editExperience = async (
  id,
  user,
  { org_id, title, description, skills, start_at, end_at, city, country, employment_type, job_category_id }
) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE experiences SET
      org_id=${org_id},
      title=${title},
      description=${description},
      skills=${skills},
      start_at=${start_at},
      end_at=${end_at},
      city=${city},
      country=${country},
      employment_type=${employment_type},
      job_category_id=${job_category_id}
    WHERE id=${id} AND user_id=${user.id}
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeExperience = async (id, user) => {
  await app.db.query(sql`DELETE FROM experiences WHERE id=${id} AND user_id=${user.id}`)
}

export const getExperience = async (id) => {
  return app.db.get(sql`SELECT * FROM experiences WHERE id=${id}`)
}

export const getRequestExperienceCredentials = async (id) => {
  return app.db.get(sql`
  SELECT 
    c.*,
    row_to_json(e.*) AS experience,
    row_to_json(u.*) AS user,
    row_to_json(o.*) AS org,
    row_to_json(j.*) AS job_category
  FROM experience_credentials c
    JOIN experiences e ON e.id=c.experience_id
    JOIN users u ON u.id=c.user_id
    JOIN organizations o ON o.id=c.org_id
    LEFT JOIN job_categories j ON j.id=e.job_category_id
    WHERE c.id=${id}
  `)
}

export const getRequestExperienceCredentialsbyConnection = async (connectId) => {
  return app.db.get(sql`
    SELECT 
    c.*,
    row_to_json(e.*) AS experience,
    row_to_json(u.*) AS user,
    row_to_json(o.*) AS org,
    row_to_json(j.*) AS job_category
    FROM experience_credentials c
    JOIN experiences e ON e.id=c.experience_id
    JOIN users u ON u.id=c.user_id
    JOIN organizations o ON o.id=c.org_id
    LEFT JOIN job_categories j ON j.id=e.job_category_id
    WHERE c.connection_id=${connectId}
  `)
}

export const experienceCredentialsFilters = {
  status: String
}

export const requestExperienceCredentials = async (id, userId, orgId, message) => {
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO experience_credentials (
        user_id,
        org_id,
        experience_id,
        message
      ) VALUES (
        ${userId},
        ${orgId},
        ${id},
        ${message}
      )
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const requestedExperienceCredentials = async (identityId, { limit = 10, offset = 0, filter }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(c.*) OVER () as total_count,
      c.*,
      row_to_json(e.*) AS experience,
      row_to_json(u.*) AS user,
    row_to_json(o.*) AS org
    FROM experience_credentials c
    JOIN experiences e ON e.id=c.experience_id
    JOIN users u ON u.id=c.user_id
    JOIN organizations o ON o.id=c.org_id
      WHERE (c.org_id = ${identityId} OR c.user_id = ${identityId})
    ${filtering(filter, experienceCredentialsFilters, true, 'c')}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const requestedExperienceCredentialsUpdate = async ({
  id,
  status,
  connection_id = null,
  connection_url = null
}) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE experience_credentials SET
        status=${status},
        connection_id=${connection_id},
        connection_url=${connection_url},
        updated_at=Now()
      WHERE id=${id}
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}
