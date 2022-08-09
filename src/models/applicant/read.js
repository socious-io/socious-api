import sql from 'sql-template-tag';
import {app} from '../../index.js';

export const get = async (id) => {
  return app.db.get(
    sql`SELECT * FROM applicants WHERE id=${id}`,
  );
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

export const permissioned = async (identityId, id) => {
  const applicant = await get(id);
  if (applicant.identity_id !== identityId) throw new PermissionError('Not allow');
};


