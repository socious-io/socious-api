import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const getMarkByIdentityAndTypeAndProjectId = async (projectId, identityId, marked_as) => {
  const { rows } = await app.db.query(
    sql`SELECT * FROM project_marks WHERE identity_id=${identityId} AND project_id=${projectId} AND marked_as=${marked_as} ORDER BY created_at`
  )
  return rows
}

export const addMark = async (projectId, identityId, mark_as) => {
  try {
    const { rows } = await app.db.query(sql`INSERT INTO project_marks 
    (project_id, identity_id, marked_as)
    VALUES (${projectId}, ${identityId}, ${mark_as})
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeMark = async (identityId, projectId) => {
  try {
    await app.db.query(sql`
    DELETE FROM project_marks WHERE project_id=${projectId} AND identity_id=${identityId}
  `)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const getMarkedProjects = async (identityId, markedAs) => {
  const { rows } = await app.db.query(
    sql`SELECT * FROM project_marks WHERE identity_id=${identityId} AND marked_as=${markedAs} ORDER BY created_at`
  )
  return rows
}
