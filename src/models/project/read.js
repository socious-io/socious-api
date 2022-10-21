import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';
import {filtering, textSearch, sorting} from '../../utils/query.js';

export const filterColumns = [
  'country',
  'causes_tags',
  'skills',
  'payment_type',
  'payment_scheme',
  'status',
  'identity_id',
  'payment_currency',
  'project_type',
  'project_length',
  'other_party_title'
];

export const sortColumns = [
  'created_at',
  'updated_at',
  'title',
  'payment_range_higher',
  'payment_range_lower'
];

export const get = async (id, userId = undefined) => {
  return app.db.get(sql`
  SELECT p.*, i.type  as identity_type, i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags,
    (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants,
    EXISTS(SELECT id FROM applicants WHERE project_id=${id} AND user_id=${userId}) AS applied
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
  WHERE p.id=${id}
  `);
};

export const getAll = async (ids, sort) => {
  const {rows} = await app.db.query(sql`
  SELECT p.*,
    i.type  as identity_type,
    i.meta as identity_meta,
    array_to_json(p.causes_tags) AS causes_tags,
    (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants
    FROM projects p
    JOIN identities i ON i.id=p.identity_id
  WHERE p.id=ANY(${ids})
  ${sorting(sort, sortColumns)}
  `);
  return rows;
};

export const all = async ({offset = 0, limit = 10, filter, sort}) => {
  const {rows} = await app.db.query(sql`
      SELECT COUNT(*) OVER () as total_count, p.*,
      array_to_json(p.causes_tags) AS causes_tags,
      i.type  as identity_type, i.meta as identity_meta,
      (SELECT COUNT(*) FROM applicants a WHERE a.project_id=p.id)::int AS applicants
      FROM projects p
      JOIN identities i ON i.id=p.identity_id
      ${filtering(filter, filterColumns, false)}
      ${sorting(sort, sortColumns)}
      LIMIT ${limit} OFFSET ${offset}`);
  return rows;
};

export const permissioned = async (identityId, id) => {
  const project = await get(id);
  if (project.identity_id !== identityId)
    throw new PermissionError('Not allow');
};

export const search = async (q, {offset= 0, limit = 10, filter, sort}) => {

  const {rows} = await app.db.query(sql`
    SELECT
      p.id
    FROM projects p
    WHERE
      p.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
  `)

  const projects = await getAll(rows.map(r => r.id).slice(offset, offset + limit), sort)

  return projects.map(r => {
    return {
      total_count: rows.length,
      ...r
    }
  })
}
