import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';

export const getAnswers = async (id) => {
  const {rows} = await app.db.query(
    sql`SELECT * FROM answers WHERE applicant_id=${id}`,
  );
  return rows;
};

export const get = async (id) => {
  const applicant = await app.db.get(
    sql`SELECT a.*, i.meta as user
    FROM applicants a
    JOIN identities i ON i.id=a.user_id
    WHERE id=${id}`,
  );
  applicant.answers = await getAnswers(id);
  return applicant;
};

export const all = async ({offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, 
      applicants.* FROM applicants ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const getByUserId = async (userId, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, 
      applicants.* FROM applicants WHERE user_id=${userId} ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const getByProjectId = async (projectId, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, 
      applicants.* FROM applicants WHERE project_id=${projectId} ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const owner = async (userId, id) => {
  try {
    await app.db.get(
      sql`SELECT * FROM applicants WHERE id=${id} and user_id=${userId}`,
    );
  } catch {
    throw new PermissionError('not allow');
  }
};

export const projectOwner = async (identityId, id) => {
  try {
    await app.db.get(sql`SELECT * FROM applicants a 
      JOIN projects p ON a.project_id=p.id 
      WHERE id=${id} AND p.identity_id=${identityId}`);
  } catch {
    throw new PermissionError('now allow');
  }
};
