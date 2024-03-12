import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering, sorting } from '../../utils/query.js'

export const filterColumns = {
  project_id: String,
  applicant_id: String,
  status: String
}

export const sortColumns = ['created_at', 'updated_at']

export const get = async (id) => {
  return app.db.get(sql`
    SELECT 
      o.*,
      row_to_json(j.*) AS job_category,
      row_to_json(p.*) AS project,
      row_to_json(offerer.*) AS offerer,
      row_to_json(recipient.*) AS recipient,
      row_to_json(org.*) AS organization,
      row_to_json(a.*) AS applicant,
      row_to_json(e.*) AS escrow,
      row_to_json(m.*) AS mission,
      row_to_json(pay.*) AS payment,
      row_to_json(f1.*) AS user_feedback,
      row_to_json(f2.*) AS org_feedback
    FROM offers o
    JOIN projects p ON p.id=o.project_id
    JOIN identities offerer ON offerer.id=o.offerer_id
    JOIN identities recipient ON recipient.id=o.recipient_id
    LEFT JOIN job_categories j ON j.id=p.job_category_id
    LEFT JOIN organizations org ON org.id=o.offerer_id
    LEFT JOIN applicants a ON a.id=o.applicant_id
    LEFT JOIN escrows e ON e.offer_id=o.id
    LEFT JOIN missions m ON m.offer_id=o.id
    LEFT JOIN payments pay ON pay.id=e.payment_id
    LEFT JOIN feedbacks f1 ON f1.mission_id=m.id AND f1.identity_id=recipient.id
    LEFT JOIN feedbacks f2 ON f2.mission_id=m.id AND f2.identity_id=offerer.id
    WHERE o.id=${id}
  `)
}

export const getAll = async (identityId, { limit = 10, offset = 0, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT 
      COUNT(*) OVER () as total_count,
      o.*,
      row_to_json(j.*) AS job_category,
      row_to_json(p.*) AS project,
      row_to_json(offerer.*) AS offerer,
      row_to_json(recipient.*) AS recipient,
      row_to_json(org.*) AS organization,
      row_to_json(a.*) AS applicant,
      row_to_json(e.*) AS escrow,
      row_to_json(m.*) AS mission,
      row_to_json(pay.*) AS payment,
      row_to_json(f1.*) AS user_feedback,
      row_to_json(f2.*) AS org_feedback
    FROM offers o
    JOIN projects p ON p.id=o.project_id
    JOIN identities offerer ON offerer.id=o.offerer_id
    JOIN identities recipient ON recipient.id=o.recipient_id
    LEFT JOIN job_categories j ON j.id=p.job_category_id
    LEFT JOIN organizations org ON org.id=o.offerer_id
    LEFT JOIN applicants a ON a.id=o.applicant_id
    LEFT JOIN escrows e ON e.offer_id=o.id
    LEFT JOIN missions m ON m.offer_id=o.id
    LEFT JOIN payments pay ON pay.id=e.payment_id
    LEFT JOIN feedbacks f1 ON f1.mission_id=m.id AND f1.identity_id=recipient.id
    LEFT JOIN feedbacks f2 ON f2.mission_id=m.id AND f2.identity_id=offerer.id
    WHERE (o.recipient_id = ${identityId} OR o.offerer_id = ${identityId})
    ${filtering(filter, filterColumns, true, 'o')}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const offerer = async (identityId, id) => {
  return app.db.get(sql`
    SELECT o.*, row_to_json(p.*) AS project
    FROM offers o
    JOIN projects p ON p.id=o.project_id
    WHERE o.offerer_id = ${identityId} AND o.id=${id}
  `)
}

export const recipient = async (identityId, id) => {
  return app.db.get(sql`
    SELECT o.*, row_to_json(p.*) AS project
    FROM offers o
    JOIN projects p ON p.id=o.project_id
    WHERE o.recipient_id = ${identityId} AND o.id=${id}
  `)
}

export const permission = async (identityId, id) => {
  return app.db.get(sql`
    SELECT o.*, row_to_json(p.*) AS project
    FROM offers o
    JOIN projects p ON p.id=o.project_id
    WHERE (o.recipient_id = ${identityId} OR o.offerer_id = ${identityId}) AND o.id=${id}
  `)
}
