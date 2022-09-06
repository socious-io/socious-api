import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {questionSchema} from './schema.js';

export const addQuestion = async (projectId, body) => {
  await questionSchema.validateAsync(body);
  try {
    const {rows} = await app.db.query(sql`INSERT INTO questions 
    (project_id, question, required, options)
    VALUES (${projectId}, ${body.question}, ${body.required}, ${body.options})
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const updateQuestion = async (id, body) => {
  await questionSchema.validateAsync(body);
  try {
    const {rows} = await app.db.query(sql`
    UPDATE questions SET
      question=${body.question},
      required=${body.required},
      options=${body.options}
    WHERE id=${id}
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const getQuestions = async (projectId) => {
  const {rows} = await app.db.query(
    sql`SELECT * FROM questions WHERE project_id=${projectId}`,
  );
  return rows;
};
