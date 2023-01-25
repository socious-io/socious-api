import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

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
  {
    mission_id,
    social_cause,
    social_cause_category,
    total_points,
    submitted_work_id
  }
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

export const history = async (identityId, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
  SELECT 
    COUNT(*) OVER () as total_count,
    i.*,
    row_to_json(m.*) AS mission,
    row_to_json(p.*) AS project,
    row_to_json(org.*) AS organization
  FROM impact_points_history i
  LEFT JOIN missions m ON m.id=i.mission_id
  LEFT JOIN projects p ON p.id=m.project_id
  LEFT JOIN organizations org ON org.id=p.identity_id
  WHERE i.identity_id=${identityId}
  ORDER BY i.created_at DESC
  LIMIT ${limit} OFFSET ${offset}
    `)
  return rows
}

export const get = async (id) => {
  const { rows } = await app.db.query(sql`
  SELECT 
    COUNT(*) OVER () as total_count,
    i.*,
    row_to_json(m.*) AS mission,
    row_to_json(p.*) AS project,
    row_to_json(org.*) AS organization
  FROM impact_points_history i
  JOIN missions m ON m.id=i.mission_id
  JOIN projects p ON p.id=m.project_id
  JOIN organizations org ON org.id=p.identity_id
  WHERE i.id=${id}
    `)
  return rows
}

export const impactPointsCalculatedWorksIds = async (missionId) => {
  const { rows } = await app.db.query(sql`
    SELECT submitted_work_id FROM impact_points_history WHERE mission_id=${missionId}
  `)
  return rows.map((r) => r.submitted_work_id)
}
