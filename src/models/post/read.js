import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';

// TODO: we can add filters
export const all = async ({offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, 
    posts.*, i.type  as identity_type, i.meta as identity_meta
    FROM posts JOIN identities i ON posts.identity_id=i.id
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const get = async (id) => {
  return app.db.get(sql`
  SELECT posts.*, i.type as identity_type, i.meta as identity_meta 
  FROM posts JOIN identities i ON posts.identity_id=i.id AND posts.id=${id}`);
};

export const permissioned = async (identity_id, id) => {
  const post = await get(id);
  if (post.identity_id !== identity_id) throw new PermissionError('Not allow');
};
