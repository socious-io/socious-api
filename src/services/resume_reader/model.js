import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const getAll = async (identityId, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
    SELECT * FROM imports WHERE identity_id=${identityId}
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const get = async (id, identityId) => {
  return app.db.get(sql`SELECT * FROM imports WHERE identity_id=${identityId} AND id=${id}`)
}

export const insert = async (identityId, { body, type }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO imports (identity_id, body, type)
      VALUES(${identityId}, ${body}, ${type})
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const update = async (identityId, { body, status }) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE imports
      SET body=${body}, status=${status}
    WHERE identity_id=${identityId}
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}
