import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'
import { filtering, sorting } from '../../utils/query.js'

export const filterColumns = {
  social_cause: String,
  social_cause_category: String
}

export const sortColumns = ['created_at', 'total_points']

export const badges = async (identityId) => {
  const { rows } = await app.db.query(sql`
    SELECT SUM(total_points) AS total_points, COUNT(*)::int , social_cause_category 
    FROM impact_points_history
    WHERE identity_id=${identityId}
    GROUP BY social_cause_category
  `)
  return rows
}

export const addHistory = async (
  identityId,
  { mission_id, social_cause, social_cause_category, total_points, submitted_work_id }
) => {
  try {
    return app.db.get(sql`
      INSERT INTO impact_points_history (total_points, mission_id, identity_id, social_cause, social_cause_category, submitted_work_id)
      VALUES (${total_points}, ${mission_id}, ${identityId}, ${social_cause}, ${social_cause_category}, ${submitted_work_id})
      RETURNING id
    `)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

/**
 * @param {string} identityId
 * @returns {Promise<import('../../../types/associations').IImpactPointHistoryAsso[]>}
 */
export const history = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
  SELECT 
    COUNT(*) OVER () as total_count,
    i.*,
    row_to_json(m.*) AS mission,
    row_to_json(p.*) AS project,
    row_to_json(org.*) AS organization,
    row_to_json(cat.*) AS job_category,
    row_to_json(o.*) AS offer
  FROM impact_points_history i
  LEFT JOIN missions m ON m.id=i.mission_id
  LEFT JOIN projects p ON p.id=m.project_id
  LEFT JOIN job_categories cat ON cat.id=p.job_category_id
  LEFT JOIN offers o ON o.id=m.offer_id
  LEFT JOIN identities org ON org.id=p.identity_id
  WHERE i.identity_id=${identityId}
  ${filtering(filter, filterColumns)}
  ${sorting(sort, sortColumns)}
  LIMIT ${limit} OFFSET ${offset}
    `)
  return rows
}

/**
 * @param {string} id
 * @returns {Promise<import('../../../types/associations').IImpactPointHistoryAsso>}
 */
export const get = async (id) => {
  return app.db.get(sql`
  SELECT 
    COUNT(*) OVER () as total_count,
    i.*,
    row_to_json(m.*) AS mission,
    row_to_json(p.*) AS project,
    row_to_json(org.*) AS organization
  FROM impact_points_history i
  LEFT JOIN missions m ON m.id=i.mission_id
  LEFT JOIN projects p ON p.id=m.project_id
  LEFT JOIN identities org ON org.id=p.identity_id
  WHERE i.id=${id}
    `)
}

export const impactPointsCalculatedWorksIds = async (missionId) => {
  const { rows } = await app.db.query(sql`
    SELECT submitted_work_id FROM impact_points_history WHERE mission_id=${missionId}
  `)
  return rows.map((r) => r.submitted_work_id)
}
