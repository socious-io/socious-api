import sql from 'sql-template-tag'
import { app } from '../../index.js'

export const insert = async (id, options, info, to, subject, body, body_type, service, date) => {
  await app.db.query(
    sql`INSERT INTO emails
      (id, options, info, "to", subject, body, body_type, service, created_at)
      VALUES (
        ${id}::uuid, ${options}, ${info},
        ${to}, ${subject}, ${body}, ${body_type},
        ${service}::email_service_type, ${date})`
  )
}

export const identity_sent = async ({ identity_id, email, type }) => {
  return app.db.query(sql`
    INSERT INTO identities_emails (identity_id, email, type) VALUES (
      ${identity_id},
      ${email},
      ${type}
    )
  `)
}
