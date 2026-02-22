import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'
import {} from '../../utils/query.js'

export const recommended = async (identityId, entityId, entityType, order) => {
  try {
    const { rows } = await app.db.query(sql`
  INSERT INTO recommends (
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
  ON CONFLICT (identity_id, entity_id) DO
  UPDATE SET
    recommened_count=EXCLUDED.recommened_count+1,
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

export const getRecommendedProjectIds = async (user, excludeIds, savedIds, limit = 20) => {
  const socialCauses = user.social_causes || []
  const skills = user.skills || []
  const country = user.country || ''

  // Get causes from saved projects to boost similar ones
  let savedCauses = []
  if (savedIds.length > 0) {
    const { rows: savedRows } = await app.db.query(sql`
      SELECT DISTINCT unnest(causes_tags) AS cause
      FROM projects WHERE id = ANY(${savedIds})
    `)
    savedCauses = savedRows.map((r) => r.cause)
  }

  const allCauses = [...new Set([...socialCauses, ...savedCauses])]

  const { rows } = await app.db.query(sql`
    SELECT p.id,
      COALESCE(
        (SELECT COUNT(*) FROM unnest(p.causes_tags) c WHERE c = ANY(${allCauses.length > 0 ? allCauses : ['']})),
      0) * 3
      + COALESCE(
        (SELECT COUNT(*) FROM unnest(p.skills) s WHERE s = ANY(${skills.length > 0 ? skills : ['']})),
      0) * 2
      + CASE WHEN p.country = ${country} THEN 1 ELSE 0 END
      + CASE WHEN p.promoted THEN 1 ELSE 0 END
      AS score
    FROM projects p
    WHERE p.status = 'ACTIVE'
      AND p.kind = 'JOB'
      AND (p.expires_at IS NULL OR p.expires_at > NOW())
      AND (${excludeIds.length > 0} = false OR p.id != ALL(${excludeIds.length > 0 ? excludeIds : ['00000000-0000-0000-0000-000000000000']}))
    ORDER BY score DESC, p.created_at DESC
    LIMIT ${limit}
  `)

  return rows.map((r) => r.id)
}

export const getSimilarProjectIds = async (skills, causesTags, excludeId, limit = 10) => {
  const safeSkills = skills && skills.length > 0 ? skills : ['']
  const safeCauses = causesTags && causesTags.length > 0 ? causesTags : ['']

  const { rows } = await app.db.query(sql`
    SELECT p.id,
      COALESCE(
        (SELECT COUNT(*) FROM unnest(p.causes_tags) c WHERE c = ANY(${safeCauses})),
      0) * 3
      + COALESCE(
        (SELECT COUNT(*) FROM unnest(p.skills) s WHERE s = ANY(${safeSkills})),
      0) * 2
      AS score
    FROM projects p
    WHERE p.status = 'ACTIVE'
      AND p.kind = 'JOB'
      AND (p.expires_at IS NULL OR p.expires_at > NOW())
      AND p.id != ${excludeId}
    ORDER BY score DESC, p.created_at DESC
    LIMIT ${limit}
  `)

  return rows.map((r) => r.id)
}
