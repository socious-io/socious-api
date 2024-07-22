import sql from 'sql-template-tag'
import { app } from '../../index.js'

export const create = async (identityId, { title, value, description }, { transaction = null } = {}) => {
  const client = transaction ?? app.db
  const preference = await client.query(
    sql`
      INSERT INTO preferences (
        identity_id,
        title,
        value,
        description
      ) VALUES (
        ${identityId},
        ${title},
        ${value},
        ${description}
      )
      RETURNING *;
    `
  )
  return preference.rows[0]
}

export const update = async (identityId, { title, value, description }, { transaction = null } = {}) => {
  const client = transaction ?? app.db
  const preference = await client.query(
    sql`
      UPDATE preferences
      SET value=${value} AND description=${description}
      WHERE identity_id=${identityId} AND title=${title}
      RETURNING *
    `
  )
  return preference.rows[0]
}

export const updateById = async (id, { value, description }, { transaction = null } = {}) => {
  const client = transaction ?? app.db
  const preference = await client.query(
    sql`
      UPDATE preferences
      SET value=${value}, description=${description}
      WHERE id=${id}
      RETURNING *
    `
  )
  return preference.rows[0]
}
