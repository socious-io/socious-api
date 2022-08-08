import sql from 'sql-template-tag';
import {app} from '../../index.js';

export const get = async (id) => {
  return app.db.get(
    sql`SELECT * FROM applicants WHERE id=${id}`,
  );
};

export const all = async (projectId = null, userId = null, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
      sql`SELECT COUNT(*) OVER () as total_count, 
      applicants.* FROM applicants 
      WHERE
        (${!userId} OR user_id=${userId}) 
        AND (${!projectId} OR project_id=${projectId}) 
      ORDER BY 
        created_at DESC  
      LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const permissioned = async (identityId, id) => {
  const applicant = await get(id);
  if (applicant.identity_id !== identityId) throw new PermissionError('Not allow');
};


