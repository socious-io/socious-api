import Joi from 'joi';
import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';

export const get = async (id) => {
  await Joi.string().uuid().validateAsync(id);
  return app.db.get(sql`
  SELECT p.*, i.type  as identity_type, i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
  WHERE p.id=${id}
  `);
};

export const all = async ({offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      array_to_json(p.causes_tags) AS causes_tags,
      i.type  as identity_type, i.meta as identity_meta
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      ORDER BY p.created_at DESC  LIMIT ${limit} OFFSET ${offset}`);
  return rows;
};

export const allByIdentity = async (identityId, {offset = 0, limit = 10}) => {
  await Joi.string().uuid().validateAsync(identityId);
  const {rows} = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      i.type  as identity_type, i.meta as identity_meta,
      array_to_json(p.causes_tags) AS causes_tags
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      WHERE identity_id=${identityId}
      ORDER BY p.created_at DESC  LIMIT ${limit} OFFSET ${offset}`);
  return rows;
};

export const permissioned = async (identityId, id) => {
  await Joi.string().uuid().validateAsync(id);
  await Joi.string().uuid().validateAsync(identityId);
  const project = await get(id);
  if (project.identity_id !== identityId)
    throw new PermissionError('Not allow');
};
