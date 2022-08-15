import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';

export const get = async (id) => {
  return app.db.get(sql`SELECT * FROM applicants WHERE id=${id}`);
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

export const mustOwner = async (id, userId) => {
  try {
    await app.db.get(
      sql`SELECT * FROM applicants WHERE id=${id} and user_id=${userId}`,
    );
  } catch {
    throw new PermissionError('not allow');
  }
};

export const mustProjectOwner = async (id, identityId) => {
  try {
    await app.db.get(sql`SELECT * FROM applicants a 
      JOIN projects p ON a.project_id=p.id 
      WHERE id=${id} AND p.identity_id=${identityId}`);
  } catch {
    throw new PermissionError('now allow');
  }
};
