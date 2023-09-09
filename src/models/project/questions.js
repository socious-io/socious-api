import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const addQuestion = async (projectId, { question, required, options }) => {
  try {
    const { rows } = await app.db.query(sql`INSERT INTO questions 
    (project_id, question, required, options)
    VALUES (${projectId}, ${question}, ${required}, ${options})
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const updateQuestion = async (id, { question, required, options }) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE questions SET
      question=${question},
      required=${required},
      options=${options}
    WHERE id=${id}
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeQuestion = async (id) => {
  try {
    await app.db.query(sql`
    DELETE FROM questions WHERE id=${id}
  `)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const getQuestions = async (projectId) => {
  const { rows } = await app.db.query(sql`SELECT * FROM questions WHERE project_id=${projectId} ORDER BY created_at`)
  return rows
}
