import sql from 'sql-template-tag'
import { app } from '../../index.js'

export const mailbox = async (address) => {
  const { rows } = await app.db.query(sql`SELECT
  id, "to", subject, body_type, created_at as date
  FROM emails
  WHERE "to" = ${address} AND service = 'TEST'
  `)
  return rows
}

export const message = async (address, id) => {
  const { rows } = await app.db.query(sql`SELECT
  id, "to", subject, body, body_type, options, created_at as date
  FROM emails
  WHERE "to" = ${address} AND id = ${id} AND service = 'TEST'
  `)
  return rows
}
