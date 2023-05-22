import sql from 'sql-template-tag'
import { app } from '../../index.js'

// TODO: we can add filters
export const all = async (userId, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, *
    FROM notifications WHERE user_id=${userId}
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const allUnreads = async (userId, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, *
    FROM notifications WHERE user_id=${userId} AND read_at IS NULL
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const get = async (userId, id) => {
  return app.db.get(sql`
    SELECT * FROM notifications WHERE id=${id} AND user_id=${userId}
  `)
}

export const getById = async (id) => {
  return app.db.get(sql`
    SELECT * FROM notifications WHERE id=${id}
  `)
}

export const latest = async (userId, type, fromDate) => {
  const { rows } = await app.db.query(sql`
    SELECT * FROM notifications 
    WHERE user_id=${userId} 
    AND type=${type}
    AND (created_at >= ${fromDate} OR updated_at >= ${fromDate})
    ORDER BY updated_at DESC
  `)
  return rows[0]
}
