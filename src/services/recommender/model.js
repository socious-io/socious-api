import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'
import {} from '../../utils/query.js'

export const recommended = async (identityId, entityId, entityType, order) => {
  try {
    const { rows } = app.db.query(sql`
  INSERT INTO verification_credentials (
    identity_id,
    entity_id,
    entity_type,
    is_active,
    order_number
  ) VALUES (
    ${identityId},
    ${entityId},
    ${entityType},
    true,
    ${order}
  )
  ON CONFLICT (idx_identity_entity) DO 
  UPDATE SET 
    recommended_count=recommended_count+1,
    updated_at=NOW()
  RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const getRecommendeds = async (identityId, type, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, r.*
      FROM recommends r
      WHERE identity_id=${identityId} AND entity_type=${type} AND is_active=true
      ORDER BY order_number ASC
      LIMIT ${limit} OFFSET ${offset}`)
  return rows
}
