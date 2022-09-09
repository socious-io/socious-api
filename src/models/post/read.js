import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';
import Joi from 'joi';

// TODO: we can add filters
export const all = async (currentIdentity, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT 
      COUNT(*) OVER () as total_count,
      posts.*, i.type  as identity_type, i.meta as identity_meta,
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

export const allByIdentity = async (
  currentIdentity,
  identityId,
  {offset = 0, limit = 10},
) => {
  await Joi.string().uuid().validateAsync(identityId);
  const {rows} = await app.db.query(
    sql`SELECT 
      COUNT(*) OVER () as total_count,
      posts.*, i.type  as identity_type, i.meta as identity_meta,
      array_to_json(posts.causes_tags) as causes_tags,
      EXISTS (SELECT id FROM likes WHERE (post_id=posts.id OR post_id=posts.shared_id) AND identity_id=${currentIdentity}) AS liked,
      (SELECT ARRAY(SELECT url FROM media m WHERE m.id=ANY(posts.media) OR m.id=ANY(sp.media))) as media,
      row_to_json(sp.*) AS shared_post,
      row_to_json(sp_i.*) AS shared_from_identity
    FROM posts 
    JOIN identities i ON posts.identity_id=i.id
    LEFT JOIN posts sp ON sp.id = posts.shared_id
    LEFT JOIN identities sp_i ON sp.identity_id = sp_i.id
    WHERE posts.identity_id=${identityId}
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );

  return rows;
};

export const get = async (id, currentIdentity) => {
  await Joi.string().uuid().validateAsync(id);

  return app.db.get(sql`
  SELECT posts.*,
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

export const miniGet = async (id) => {
  await Joi.string().uuid().validateAsync(id);
  return app.db.get(sql`SELECT * FROM POSTS WHERE id=${id}`);
};

export const permissioned = async (identityId, id) => {
  await Joi.string().uuid().validateAsync(id);
  await Joi.string().uuid().validateAsync(identityId);
  const post = await miniGet(id);
  if (post.identity_id !== identityId) throw new PermissionError('Not allow');
};
