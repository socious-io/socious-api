import sql from 'sql-template-tag'
import { EntryError } from '../../utils/errors.js'
import { app } from '../../index.js'

export const getFeedback = async (id) => {
  return app.db.get(sql`
    SELECT f.*,
    row_to_json(i.*) AS identity
    FROM feedbacks f
    JOIN identities i ON i.id=f.identity_id
    WHERE f.id=${id}
  `)
}

export const feedback = async ({ content, is_contest, identity_id, project_id, mission_id }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO feedbacks (content, is_contest, project_id, mission_id, identity_id)
    VALUES(${content}, ${is_contest}, ${project_id}, ${mission_id}, ${identity_id})
    RETURNING id
  `)
    return getFeedback(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const feedbacks = async (projectId, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
  SELECT f.*,
  row_to_json(i.*) AS identity
  FROM feedbacks f
  JOIN identities i ON i.id=f.identity_id
  WHERE f.project_id=${projectId}
  ORDER BY f.created_at DESC  LIMIT ${limit} OFFSET ${offset}
    `)
  return rows
}



export const feedbacksForUser = async (userId, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
    SELECT 
    COUNT(*) OVER () as total_count,
    f.*,
    row_to_json(i.*) AS identity,
    row_to_json(m.*) AS mission,
    row_to_json(p.*) AS project,
    row_to_json(org.*) AS organization
    FROM feedbacks f
    LEFT JOIN identities i ON i.id=f.identity_id
    LEFT JOIN missions m ON f.mission_id=m.id
    LEFT JOIN projects p ON f.project_id=p.id
    LEFT JOIN organizations org ON org.id=m.assigner_id
    WHERE m.assignee_id = ${userId}
    ORDER BY f.created_at DESC  LIMIT ${limit} OFFSET ${offset}
    `)
    
    return rows
}


export const feedbacksRating = async (userId) => {
  const { rows } = await app.db.query(sql`
    SELECT 
      COUNT(*) AS total_count,
      COUNT(*) FILTER (WHERE is_contest = true) AS contests_count
    FROM feedbacks f
      LEFT JOIN missions m ON f.mission_id=m.id
      WHERE m.assignee_id = ${userId}
    `)
    if (rows.length < 1) return 0
    const total = Number(rows[0].total_count)
    const contests = Number(rows[0].contests_count)
    
    return Number((1 - (contests / total)).toFixed(2))
}
