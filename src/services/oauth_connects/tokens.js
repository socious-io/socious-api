import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const upsert = async (identityId, { provider, mui, access_token, refresh_token, expire, status, meta }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO oauth_connects
    (identity_id, provider, matrix_unique_id, access_token, refresh_token, expired_at, status, meta)
    VALUES (${identityId}, ${provider}, ${mui}, ${access_token}, ${refresh_token}, ${expire}, ${status}, ${meta})
    ON CONFLICT (identity_id, provider) DO
      UPDATE SET 
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        matrix_unique_id = EXCLUDED.matrix_unique_id,
        meta = EXCLUDED.meta,
        expired_at = EXCLUDED.expired_at,
        updated_at = NOW()
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const updateStatus = async (id, status) => {
  await app.db.query(sql`
  UPDATE oauth_connects SET status=${status} WHERE id=${id}
  `)
}

export const get = async (identityId, providers) => {
  return app.db.get(sql`
  SELECT * FROM oauth_connects 
  WHERE 
    identity_id=${identityId} AND 
    provider=ANY(${providers})
  `)
}
