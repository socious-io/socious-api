import sql from 'sql-template-tag'
import { app } from '../../index.js'

export const upsert = async (identityId, preferences, { transaction = null } = {}) => {
  const client = transaction ?? app.db;

  const commitedPreferences = []

  for(const preference of preferences){
    const { title, value, description } = preference;

    const commitedPreference = await client.query(
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
        ON CONFLICT (identity_id, title)
        DO UPDATE SET value = ${value}, description = ${description}
        RETURNING *;
      `
    )
    commitedPreferences.push(commitedPreference.rows[0]);
  }

  return commitedPreferences;
  
}
