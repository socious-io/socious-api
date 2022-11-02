import sql from 'sql-template-tag';
import {PermissionError} from '../../utils/errors.js';
import {app} from '../../index.js';
import {filtering, sorting} from '../../utils/query.js';

export const filterColumns = {
  project_id: String,
  applicant_id: String,
  assigner_id: String,
  assignee_id: String,
};

export const sortColumns = ['created_at', 'updated_at'];

export const get = async (id) => {
  return app.db.get(sql`
  SELECT 
    m.*,
    row_to_json(a.*) AS applicant,
    row_to_json(p.*) AS project
  FROM missions m
  JOIN applicants a ON a.id=m.applicant_id
  JOIN projects p ON p.id=m.project_id
  WHERE m.id=${id}
  `);
};

export const getAll = async ({offset = 0, limit = 10, filter, sort}) => {
  const {rows} = await app.db.query(sql`
    SELECT 
      m.*,
      row_to_json(a.*) AS applicant,
      row_to_json(p.*) AS project
    FROM missions m
    JOIN applicants a ON a.id=m.applicant_id
    JOIN projects p ON p.id=m.project_id 
    ${filtering(filter, filterColumns, false, 'm')}
    ${sorting(sort, sortColumns, 'm')}
    LIMIT ${limit} OFFSET ${offset}
    `);
  return rows;
};

export const assignee = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT m.*, row_to_json(p.*) AS project
      FROM missions m
      JOIN projects p ON p.id=m.project_id
      WHERE m.id=${id} AND m.assignee_id=${identityId}`);
  } catch {
    throw new PermissionError();
  }
};

export const assigner = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT 
        m.*,
        row_to_json(p.*) AS project
      FROM missions m
      JOIN projects p ON p.id=m.project_id
      WHERE m.id=${id} AND m.assigner_id=${identityId}
      `);
  } catch {
    throw new PermissionError();
  }
};

// assigner or assignee
export const assigneer = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT 
        m.*,
        row_to_json(p.*) AS project
      FROM missions m
      JOIN projects p ON p.id=m.project_id
      WHERE m.id=${id} AND (m.assignee_id=${identityId} OR m.assigner_id=${identityId})
      `);
  } catch {
    throw new PermissionError();
  }
};
