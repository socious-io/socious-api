import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';

export const get = async (id) => {
  return app.db.get(sql`
  SELECT p.*, i.type  as identity_type, i.meta as identity_meta
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
  WHERE p.id=${id}
  `);
};

export const all = async ({offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      i.type  as identity_type, i.meta as identity_meta
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      ORDER BY p.created_at DESC  LIMIT ${limit} OFFSET ${offset}`);
  return rows;
};

export const permissioned = async (identityId, id) => {
  const project = await get(id);
  if (project.identity_id !== identityId)
    throw new PermissionError('Not allow');
};
