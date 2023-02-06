import sql from 'sql-template-tag'

import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

const insert = async (userId, { token, meta }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO devices (user_id, token, meta)
      VALUES(${userId}, ${token}, ${meta})
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

const update = async (userId, { token, meta }) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE devices 
      SET meta=${meta}
    WHERE user_id=${userId} AND token=${token}
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

const get = async (id) => {
  return app.db.get(sql`SELECT * FROM devices WHERE id=${id}`)
}

const all = async (userId) => {
  const { rows } = await app.db.query(sql`SELECT * FROM devices WHERE user_id=${userId}`)
  return rows
}

const any = async (userIds) => {
  const { rows } = await app.db.query(sql`SELECT * FROM devices WHERE user_id=ANY(${userIds})`)
  return rows
}

const remove = async (userId, token) => {
  return app.db.query(sql`DELETE FROM devices WHERE user_id=${userId} AND token=${token}`)
}

const cleanup = async (tokens) => {
  return app.db.query(sql`DELETE FROM devices WHERE token=ANY(${tokens})`)
}

export default {
  insert,
  update,
  get,
  all,
  any,
  remove,
  cleanup
}
