import sql from 'sql-template-tag';
import {PermissionError} from '../../utils/errors.js';
import {app} from '../../index.js';

export const get = async (id) => {
  return app.db.get(sql`
  SELECT 
    e.*,
    row_to_json(a.*) AS applicant,
    row_to_json(p.*) AS project
  FROM employees e
  JOIN applicants a ON a.id=e.applicant_id
  JOIN projects p ON p.id=e.project_id
  WHERE e.id=${id}
  `);
};

export const projects = async (identityId, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
    SELECT 
      e.*,
      row_to_json(a.*) AS applicant,
      row_to_json(p.*) AS project
    FROM employees e
    JOIN applicants a ON a.id=e.applicant_id
    JOIN projects p ON p.id=e.project_id
    WHERE e.identity_id=${identityId}
    ORDER BY e.created_at DESC  LIMIT ${limit} OFFSET ${offset}
    `);
  return rows;
};

export const employees = async (
  identityId,
  projectId,
  {offset = 0, limit = 10},
) => {
  const {rows} = await app.db.query(sql`
    SELECT 
      e.*,
      row_to_json(a.*) AS applicant,
      row_to_json(p.*) AS project
    FROM employees e
    JOIN applicants a ON a.id=e.applicant_id
    JOIN projects p ON p.id=e.project_id AND p.identity_id=${identityId}
    WHERE e.project_id=${projectId}
    ORDER BY e.created_at DESC  LIMIT ${limit} OFFSET ${offset}
    `);
  return rows;
};

export const employee = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT e.*, row_to_json(p.*) AS project
      FROM employees e
      JOIN projects p ON p.id=e.project_id
      WHERE e.id=${id} AND e.identity_id=${identityId}`);
  } catch {
    throw new PermissionError();
  }
};

export const employer = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT 
        e.*,
        row_to_json(p.*) AS project
      FROM employees e
      JOIN projects p ON p.id=e.project_id
      WHERE e.id=${id} AND p.identity_id=${identityId}
      `);
  } catch {
    throw new PermissionError();
  }
};

// employer or employee
export const employeer = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT 
        e.*,
        row_to_json(p.*) AS project
      FROM employees e
      JOIN projects p ON p.id=e.project_id
      WHERE e.id=${id} AND (p.identity_id=${identityId} OR e.identity_id=${identityId})
      `);
  } catch {
    throw new PermissionError();
  }
};
