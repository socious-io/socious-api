import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';


export const upsert = async (identityId, {provider, mui, access_token, refresh_token, expire, meta}) => {
  try {
  const { rows } = await app.db.query(sql`
    INSERT INTO oauth_connects
    (identity_id, provider, matrix_unique_id, access_token, refresh_token, expired_at, meta)
    VALUES (${identityId}, ${provider}, ${mui}, ${access_token}, ${refresh_token}, ${expire}, ${meta})
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
  } catch(err) {
    throw new EntryError(err.message)
  }
}


export const get = async (identityId, provider) => {
  return app.db.get(sql`
  SELECT * FROM oauth_connects 
  WHERE 
    identity_id=${identityId} AND 
    provider=${provider}
  `)
}
