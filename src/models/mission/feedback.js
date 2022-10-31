import sql from 'sql-template-tag';
import {EntryError} from '../../utils/errors.js';
import {app} from '../../index.js';

export const getFeedback = async (id) => {
  return app.db.get(sql`
    SELECT f.*,
    row_to_json(i.*) AS identity
    FROM feedbacks f
    JOIN identities i ON i.id=f.identity_id
    WHERE f.id=${id}
  `);
};

export const feedback = async ({
  content,
  is_contest,
  identity_id,
  project_id,
  mission_id,
}) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO feedbacks (content, is_contest, project_id, mission_id, identity_id)
    VALUES(${content}, ${is_contest}, ${project_id}, ${mission_id}, ${identity_id})
    RETURNING id
  `);
    return getFeedback(rows[0].id);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const feedbacks = async (projectId, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
  SELECT f.*,
  row_to_json(i.*) AS identity
  FROM feedbacks f
  JOIN identities i ON i.id=f.identity_id
  WHERE f.project_id=${projectId}
  ORDER BY f.created_at DESC  LIMIT ${limit} OFFSET ${offset}
    `);
  return rows;
};
