import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'
import { filtering } from '../../utils/query.js'

export const filterColumns = {
  job: Object,
  marks: Array
}

export const getMarkByIdentityAndTypeAndJobId = async (projectId, identityId, type) => {
  const { rows } = await app.db.query(
    sql`SELECT * FROM job_marks WHERE identity_id=${identityId} AND job_id=${projectId} AND type=${type} ORDER BY created_at`
  )
  return rows
}

export const getAllMarksByIdentity = async (identityId, { offset = 0, limit = 10 }) => {

  const { rows } = await app.db.query(sql`
    SELECT
      row_to_json(p.*) as job, 
      jsonb_agg(
          json_build_object(
            'id', jm.id,
            'type', jm.type,
            'created_at', jm.created_at
          )
      ) as marks
    FROM job_marks jm
    JOIN projects p on jm.job_id = p.id
    WHERE jm.identity_id=${identityId}
    GROUP BY jm.job_id, p.id
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const markJob = async (projectId, identityId, type) => {
  try {
    const { rows } = await app.db.query(sql`INSERT INTO job_marks 
    (job_id, identity_id, type)
    VALUES (${projectId}, ${identityId}, ${type})
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeMark = async (identityId, markId) => {
  try {
    await app.db.query(sql`
    DELETE FROM job_marks WHERE id=${markId} AND identity_id=${identityId}
  `)
  } catch (err) {
    throw new EntryError(err.message)
  }
}
