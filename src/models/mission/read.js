import sql from 'sql-template-tag'
import { PermissionError } from '../../utils/errors.js'
import { app } from '../../index.js'
import { filtering, sorting } from '../../utils/query.js'

export const filterColumns = {
  project_id: String,
  applicant_id: String,
  assigner_id: String,
  assignee_id: String,
  status: String,
  'o.payment_mode': String,
  'p.payment_type': String
}

export const sortColumns = ['created_at', 'updated_at']

export const get = async (id) => {
  return app.db.get(sql`
  SELECT 
    m.*,
    row_to_json(j.*) AS job_category,
    row_to_json(a.*) AS applicant,
    row_to_json(p.*) AS project,
    row_to_json(i1.*) AS assignee,
    row_to_json(i2.*) AS assigner,
    row_to_json(es.*) AS escrow,
    row_to_json(o.*) AS offer,
    row_to_json(pay.*) AS payment,
    row_to_json(org.*) AS organization,
    row_to_json(f1.*) AS user_feedback,
    row_to_json(f2.*) AS org_feedback,
    (SELECT
      jsonb_agg(
        json_build_object(
          'id', s.id, 
          'status', s.status, 
          'total_hours', s.total_hours,
          'start_at', s.start_at,
          'end_at', s.end_at,
          'created_at', s.created_at 
        )
      )
      FROM submitted_works s
      WHERE s.mission_id=m.id
    ) AS submitted_works
  FROM missions m
  LEFT JOIN applicants a ON a.id=m.applicant_id
  JOIN projects p ON p.id=m.project_id
  JOIN identities i1 ON i1.id=m.assignee_id
  JOIN identities i2 ON i2.id=m.assigner_id
  LEFT JOIN offers o ON o.id=m.offer_id
  LEFT JOIN job_categories j ON j.id=p.job_category_id
  LEFT JOIN organizations org ON org.id=m.assigner_id
  LEFT JOIN escrows es ON es.mission_id=m.id
  LEFT JOIN payments pay ON pay.id=es.payment_id
  LEFT JOIN feedbacks f1 ON f1.mission_id=m.id AND f1.identity_id=i1.id
  LEFT JOIN feedbacks f2 ON f2.mission_id=m.id AND f2.identity_id=i2.id
  WHERE m.id=${id}
  `)
}

export const getByOffer = async (offerId) => {
  return app.db.get(sql`
  SELECT 
    m.*,
    row_to_json(j.*) AS job_category,
    row_to_json(a.*) AS applicant,
    row_to_json(p.*) AS project,
    row_to_json(i1.*) AS assignee,
    row_to_json(i2.*) AS assigner,
    row_to_json(es.*) AS escrow,
    row_to_json(pay.*) AS payment,
    row_to_json(org.*) AS organization,
    row_to_json(o.*) AS offer,
    row_to_json(f1.*) AS user_feedback,
    row_to_json(f2.*) AS org_feedback,
    (SELECT
      jsonb_agg(
        json_build_object(
          'id', s.id, 
          'status', s.status, 
          'total_hours', s.total_hours,
          'start_at', s.start_at,
          'end_at', s.end_at,
          'created_at', s.created_at 
        )
      )
      FROM submitted_works s
      WHERE s.mission_id=m.id
    ) AS submitted_works
  FROM missions m
  LEFT JOIN applicants a ON a.id=m.applicant_id
  JOIN projects p ON p.id=m.project_id
  JOIN identities i1 ON i1.id=m.assignee_id
  JOIN identities i2 ON i2.id=m.assigner_id
  LEFT JOIN offers o ON o.id=m.offer_id
  LEFT JOIN job_categories j ON j.id=p.job_category_id
  LEFT JOIN organizations org ON org.id=m.assigner_id
  LEFT JOIN escrows es ON es.mission_id=m.id
  LEFT JOIN payments pay ON pay.id=es.payment_id
  LEFT JOIN feedbacks f1 ON f1.mission_id=m.id AND f1.identity_id=i1.id
  LEFT JOIN feedbacks f2 ON f2.mission_id=m.id AND f2.identity_id=i2.id
  WHERE m.offer_id=${offerId}
  `)
}

export const getAll = async ({ offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(*) OVER () as total_count, 
      m.*,
      row_to_json(j.*) AS job_category,
      row_to_json(a.*) AS applicant,
      row_to_json(p.*) AS project,
      row_to_json(i1.*) AS assignee,
      row_to_json(i2.*) AS assigner,
      row_to_json(es.*) AS escrow,
      row_to_json(pay.*) AS payment,
      row_to_json(org.*) AS organization,
      row_to_json(o.*) AS offer,
      row_to_json(f1.*) AS user_feedback,
    row_to_json(f2.*) AS org_feedback,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', s.id,
            'status', s.status, 
            'total_hours', s.total_hours,
            'start_at', s.start_at,
            'end_at', s.end_at,
            'created_at', s.created_at 
          )
        )
        FROM submitted_works s
        WHERE s.mission_id=m.id
      ) AS submitted_works
    FROM missions m
    LEFT JOIN applicants a ON a.id=m.applicant_id
    JOIN projects p ON p.id=m.project_id
    JOIN identities i1 ON i1.id=m.assignee_id
    JOIN identities i2 ON i2.id=m.assigner_id
    LEFT JOIN offers o ON o.id=m.offer_id
    LEFT JOIN job_categories j ON j.id=p.job_category_id
    LEFT JOIN organizations org ON org.id=m.assigner_id
    LEFT JOIN escrows es ON es.mission_id=m.id
    LEFT JOIN payments pay ON pay.id=es.payment_id
    LEFT JOIN feedbacks f1 ON f1.mission_id=m.id AND f1.identity_id=i1.id
    LEFT JOIN feedbacks f2 ON f2.mission_id=m.id AND f2.identity_id=i2.id
    ${filtering(filter, filterColumns, false, 'm')}
    ${sorting(sort, sortColumns, 'm')}
    LIMIT ${limit} OFFSET ${offset}
    `)
  return rows
}

export const getAllOwned = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(*) OVER () as total_count, 
      m.*,
      row_to_json(j.*) AS job_category,
      row_to_json(a.*) AS applicant,
      row_to_json(p.*) AS project,
      row_to_json(i1.*) AS assignee,
      row_to_json(i2.*) AS assigner,
      row_to_json(es.*) AS escrow,
      row_to_json(pay.*) AS payment,
      row_to_json(org.*) AS organization,
      row_to_json(o.*) AS offer,
      row_to_json(f1.*) AS user_feedback,
    row_to_json(f2.*) AS org_feedback,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', s.id,
            'status', s.status, 
            'total_hours', s.total_hours,
            'start_at', s.start_at,
            'end_at', s.end_at,
            'created_at', s.created_at 
          )
        )
        FROM submitted_works s
        WHERE s.mission_id=m.id
      ) AS submitted_works
    FROM missions m
    LEFT JOIN applicants a ON a.id=m.applicant_id
    JOIN projects p ON p.id=m.project_id
    JOIN identities i1 ON i1.id=m.assignee_id
    JOIN identities i2 ON i2.id=m.assigner_id
    LEFT JOIN offers o ON o.id=m.offer_id
    LEFT JOIN job_categories j ON j.id=p.job_category_id
    LEFT JOIN organizations org ON org.id=m.assigner_id
    LEFT JOIN escrows es ON es.mission_id=m.id
    LEFT JOIN payments pay ON pay.id=es.payment_id
    LEFT JOIN feedbacks f1 ON f1.mission_id=m.id AND f1.identity_id=i1.id
    LEFT JOIN feedbacks f2 ON f2.mission_id=m.id AND f2.identity_id=i2.id
    WHERE (o.recipient_id = ${identityId} OR o.offerer_id = ${identityId})
    ${filtering(filter, filterColumns, true, 'm')}
    ${sorting(sort, sortColumns, 'm')}
    LIMIT ${limit} OFFSET ${offset}
    `)
  return rows
}

export const assignee = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT m.*, row_to_json(p.*) AS project
      FROM missions m
      JOIN projects p ON p.id=m.project_id
      WHERE m.id=${id} AND m.assignee_id=${identityId}`)
  } catch {
    throw new PermissionError()
  }
}

export const assigner = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT 
        m.*,
        row_to_json(p.*) AS project
      FROM missions m
      JOIN projects p ON p.id=m.project_id
      WHERE m.id=${id} AND m.assigner_id=${identityId}
      `)
  } catch {
    throw new PermissionError()
  }
}

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
      `)
  } catch {
    throw new PermissionError()
  }
}
