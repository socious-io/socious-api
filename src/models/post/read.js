import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';

// TODO: we can add filters
export const all = async (currentIdentity, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT 
      COUNT(*) OVER () as total_count, 
      posts.*, i.type  as identity_type, i.meta as identity_meta,
      array_to_json(posts.causes_tags) as causes_tags,
      EXISTS (SELECT id FROM likes WHERE post_id=posts.id AND identity_id=${currentIdentity}) AS liked,
      (SELECT ARRAY(SELECT url FROM media m WHERE m.id=ANY(posts.media))) as media
    FROM posts 
    JOIN identities i ON posts.identity_id=i.id
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const get = async (id, currentIdentity) => {
  return app.db.get(sql`
  SELECT posts.*, array_to_json(posts.causes_tags) AS causes_tags,
    i.type AS identity_type, i.meta AS identity_meta, 
    EXISTS (SELECT id FROM likes WHERE post_id=posts.id AND identity_id=${currentIdentity}) AS liked,
    (SELECT ARRAY(SELECT url FROM media m WHERE m.id=ANY(posts.media))) as media
  FROM posts 
  JOIN identities i ON posts.identity_id=i.id
  WHERE posts.id=${id}`);
};

export const permissioned = async (identityId, id) => {
  const post = await get(id);
  if (post.identity_id !== identityId) throw new PermissionError('Not allow');
};
