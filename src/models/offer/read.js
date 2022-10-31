import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {filtering, sorting} from '../../utils/query.js';

export const filterColumns = {
  project_id: String,
  applicant_id: String,
  status: String,
};

export const sortColumns = ['created_at', 'updated_at'];

export const get = async (id) => {
  return app.db.get(sql`
    SELECT * FROM offers WHERE id=${id}
  `);
};

export const getAll = async (
  identityId,
  {limit = 10, offset = 0, filter, sort},
) => {
  const {rows} = await app.db.query(sql`
    SELECT * FROM offers
    WHERE (recipient_id = ${identityId} OR offerer_id = ${identityId})
    ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
  `);
  return rows;
};

export const offerer = async (identityId, id) => {
  return app.db.get(sql`
    SELECT o.*, row_to_json(p.*) AS project
    FROM offers o
    JOIN projects p ON p.id=o.project_id
    WHERE o.offerer_id = ${identityId} AND o.id=${id}
  `);
};

export const recipient = async (identityId, id) => {
  return app.db.get(sql`
    SELECT o.*, row_to_json(p.*) AS project
    FROM offers o
    JOIN projects p ON p.id=o.project_id
    WHERE o.recipient_id = ${identityId} AND o.id=${id}
  `);
};
