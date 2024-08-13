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

export const get_identity_sent = async ({ identity_id, email, type }) => {
  const { rows } = await app.db.query(sql`
    SELECT * FROM identities_emails 
    WHERE identity_id=${identity_id} AND 
    email=${email}
    AND type=${type} AND 
    created_at >= NOW() - INTERVAL '2 weeks'
  `)
  return rows
}
