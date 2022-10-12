import sql, {raw} from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';

export const get = async (id) => {
  return app.db.get(sql`
  SELECT p.*, i.type  as identity_type, i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags,
    (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
  WHERE p.id=${id}
  `);
};

export const getAll = async (ids) => {
  const {rows} = await app.db.query(sql`
  SELECT p.*,
    i.type  as identity_type,
    i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags,
    (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
  WHERE p.id=ANY(${ids})
  `);
  return rows;
};

export const all = async ({offset = 0, limit = 10}, status) => {
  const where = status
    ? status instanceof Array
      ? sql`WHERE status = ANY(${status})`
      : sql`WHERE status = ${status}`
    : raw('');
  const {rows} = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      array_to_json(p.causes_tags) AS causes_tags,
      i.type  as identity_type, i.meta as identity_meta,
      (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      ${where}
      ORDER BY p.created_at DESC  LIMIT ${limit} OFFSET ${offset}`);
  return rows;
};

export const allByIdentity = async (identityId, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      i.type  as identity_type, i.meta as identity_meta,
      array_to_json(p.causes_tags) AS causes_tags,
      (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      WHERE identity_id=${identityId}
      ORDER BY p.created_at DESC  LIMIT ${limit} OFFSET ${offset}`);
  return rows;
};

export const permissioned = async (identityId, id) => {
  const project = await get(id);
  if (project.identity_id !== identityId)
    throw new PermissionError('Not allow');
};

export const filterColumns = [
  'country',
  'causes_tags',
  'skills',
  'payment_type',
  'payment_scheme',
  'status',
];
