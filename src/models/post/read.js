import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';

// TODO: we can add filters
export const all = async (currentIdentity, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT 
      COUNT(*) OVER () as total_count,
      posts.*, i.type  as identity_type, i.meta as identity_meta,
      (CASE
        WHEN posts.shared_id IS NOT NULL THEN sp.content
        ELSE posts.content
      END) AS content,
      array_to_json(posts.causes_tags) as causes_tags,
      EXISTS (SELECT id FROM likes WHERE (post_id=posts.id OR post_id=posts.shared_id) AND identity_id=${currentIdentity}) AS liked,
      (SELECT ARRAY(SELECT url FROM media m WHERE m.id=ANY(posts.media) OR m.id=ANY(sp.media))) as media,
      row_to_json(sp.*) AS shared_post,
      row_to_json(sp_i.*) AS shared_from_identity
    FROM posts 
    JOIN identities i ON posts.identity_id=i.id
    LEFT JOIN posts sp ON sp.id = posts.shared_id
    LEFT JOIN identities sp_i ON sp.identity_id = sp_i.id
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const get = async (id, currentIdentity) => {
  return app.db.get(sql`
  SELECT posts.*, (CASE
      WHEN posts.shared_id IS NOT NULL THEN sp.content
      ELSE posts.content
    END) AS content,
    array_to_json(posts.causes_tags) as causes_tags,
    i.type AS identity_type, i.meta AS identity_meta, 
    EXISTS (SELECT id FROM likes WHERE (post_id=posts.id OR post_id=posts.shared_id) AND identity_id=${currentIdentity}) AS liked,
    (SELECT ARRAY(SELECT url FROM media m WHERE m.id=ANY(posts.media) OR m.id=ANY(sp.media))) as media,
    row_to_json(sp.*) AS shared_post,
    row_to_json(sp_i.*) AS shared_from_identity
  FROM posts 
  JOIN identities i ON posts.identity_id=i.id
  LEFT JOIN posts sp ON sp.id = posts.shared_id
  LEFT JOIN identities sp_i ON sp.identity_id = sp_i.id
  WHERE posts.id=${id}`);
};

export const permissioned = async (identityId, id) => {
  const post = await get(id);
  if (post.identity_id !== identityId) throw new PermissionError('Not allow');
};
