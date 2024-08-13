import sql, { raw, join } from 'sql-template-tag'
import { app } from '../../index.js'

export const upsert = async (identityId, preferences, { transaction = null } = {}) => {
  const client = transaction ?? app.db

  let query = raw(`INSERT INTO preferences (identity_id, title, value, description) VALUES`)

  const values = []

  for (const preference of preferences) {
    const { title, value, description } = preference

    values.push(
      sql`(
        ${identityId},
        ${title},
        ${value},
        ${description ? description : null}
      )`
    )
  }

  const onConflict = raw(`
    ON CONFLICT (identity_id, title)
    DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description
    RETURNING title, value, description
  `)

  query = join([query, join(values, ','), onConflict], ' ')

  const result = await client.query(query)

  return result.rows
}
