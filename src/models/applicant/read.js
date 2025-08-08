import sql from 'sql-template-tag'
import User from '../user/index.js'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { filtering, sorting, textSearch } from '../../utils/query.js'
import Data from '@socious/data'

const StatusTypes = Data.ApplicantStatus

export const filterColumns = {
  project_id: String,
  user_id: String,
  status: String
}

export const sortColumns = ['created_at', 'updated_at']

export const getAnswers = async (id) => {
  const { rows } = await app.db.query(sql`SELECT * FROM answers WHERE applicant_id=${id}`)
  return rows
}

export const get = async (id) => {
  const applicant = await app.db.get(
    sql`SELECT 
      a.*, i.meta as user,
      row_to_json(m.*) AS attachment,
      row_to_json(p.*) AS project,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', ans.id, 
            'question_id', ans.question_id, 
            'answer', ans.answer,
            'selected_option', ans.selected_option,
            'created_at', ans.created_at,
            'updated_at', ans.updated_at
          )
        )
        FROM answers ans
        WHERE ans.applicant_id=a.id
      ) AS answers,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', q.id, 
            'question', q.question, 
            'required', q.required,
            'options', q.options,
            'created_at', q.created_at,
            'updated_at', q.updated_at
          )
        )
        FROM questions q
        WHERE q.project_id=a.project_id
      ) AS questions
    FROM applicants a
    JOIN identities i ON i.id=a.user_id
    LEFT JOIN media m ON m.id=a.attachment
    JOIN projects p ON p.id=a.project_id
    WHERE a.id=${id}`
  )
  applicant.user = await User.getProfile(applicant.user_id, applicant.project.identity_id)
  applicant.answers = await getAnswers(id)
  return applicant
}

export const all = async ({ offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(
    sql`SELECT COUNT(a.*) OVER () as total_count,
      a.*, i.meta as user,
      row_to_json(m.*) AS attachment,
      row_to_json(p.*) AS project,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', ans.id, 
            'question_id', ans.question_id, 
            'answer', ans.answer,
            'selected_option', ans.selected_option,
            'created_at', ans.created_at,
            'updated_at', ans.updated_at
          )
        )
        FROM answers ans
        WHERE ans.applicant_id=a.id
      ) AS answers,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', q.id, 
            'question', q.question, 
            'required', q.required,
            'options', q.options,
            'created_at', q.created_at,
            'updated_at', q.updated_at
          )
        )
        FROM questions q
        WHERE q.project_id=a.project_id
      ) AS questions
      FROM applicants a
      JOIN identities i ON i.id=a.user_id
      JOIN projects p ON p.id=a.project_id
      LEFT JOIN media m ON m.id=a.attachment
      ${filtering(filter, filterColumns, false, 'a')}
      ${sorting(sort, sortColumns)}
      LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const allByIdentity = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(
    sql`SELECT COUNT(a.*) OVER () as total_count,
      a.*, i.meta as user,
      row_to_json(m.*) AS attachment,
      row_to_json(p.*) AS project,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', ans.id, 
            'question_id', ans.question_id, 
            'answer', ans.answer,
            'selected_option', ans.selected_option,
            'created_at', ans.created_at,
            'updated_at', ans.updated_at
          )
        )
        FROM answers ans
        WHERE ans.applicant_id=a.id
      ) AS answers,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', q.id, 
            'question', q.question, 
            'required', q.required,
            'options', q.options,
            'created_at', q.created_at,
            'updated_at', q.updated_at
          )
        )
        FROM questions q
        WHERE q.project_id=a.project_id
      ) AS questions
      FROM applicants a
      JOIN identities i ON i.id=a.user_id
      JOIN projects p ON p.id=a.project_id
      LEFT JOIN media m ON m.id=a.attachment
      WHERE user_id=${identityId} OR p.identity_id=${identityId}
      ${filtering(filter, filterColumns, true, 'a')}
      ${sorting(sort, sortColumns)}
      LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const getAll = async (ids, sort) => {
  const { rows } = await app.db.query(
    sql`SELECT COUNT(a.*) OVER () as total_count,
      a.*, i.meta as user,
      row_to_json(m.*) AS attachment,
      row_to_json(p.*) AS project,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', ans.id, 
            'question_id', ans.question_id, 
            'answer', ans.answer,
            'selected_option', ans.selected_option,
            'created_at', ans.created_at,
            'updated_at', ans.updated_at
          )
        )
        FROM answers ans
        WHERE ans.applicant_id=a.id
      ) AS answers,
      (SELECT
        jsonb_agg(
          json_build_object(
            'id', q.id, 
            'question', q.question, 
            'required', q.required,
            'options', q.options,
            'created_at', q.created_at,
            'updated_at', q.updated_at
          )
        )
        FROM questions q
        WHERE q.project_id=a.project_id
      ) AS questions
      FROM applicants a
      JOIN identities i ON i.id=a.user_id
      JOIN projects p ON p.id=a.project_id
      LEFT JOIN media m ON m.id=a.attachment
      WHERE a.id=ANY(${ids})
      ${sorting(sort, sortColumns, 'a')}
      `
  )
  return rows
}

export const getByUserId = async (userId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(
    sql`
      SELECT 
        COUNT(a.*) OVER () as total_count,
        a.*, i.meta as user,
        row_to_json(m.*) AS attachment,
        row_to_json(p.*) AS project,
        row_to_json(pi.*) AS organization,
        (SELECT
          jsonb_agg(
            json_build_object(
              'id', ans.id, 
              'question_id', ans.question_id, 
              'answer', ans.answer,
              'selected_option', ans.selected_option,
              'created_at', ans.created_at,
              'updated_at', ans.updated_at
            )
          )
          FROM answers ans
          WHERE ans.applicant_id=a.id
        ) AS answers,
        (SELECT
          jsonb_agg(
            json_build_object(
              'id', q.id, 
              'question', q.question, 
              'required', q.required,
              'options', q.options,
              'created_at', q.created_at,
              'updated_at', q.updated_at
            )
          )
          FROM questions q
          WHERE q.project_id=a.project_id
        ) AS questions
      FROM applicants a
      JOIN identities i ON i.id=a.user_id
      JOIN projects p ON p.id=a.project_id
      JOIN identities pi ON pi.id=p.identity_id
      LEFT JOIN media m ON m.id=a.attachment
      WHERE 
        a.user_id=${userId} 
        ${filtering(filter, filterColumns, true, 'a')}
      ${sorting(sort, sortColumns)}
      LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const getByProjectId = async (projectId, { offset = 0, limit = 10, filter, sort, q }) => {
  q = q??'';

  const { rows } = await app.db.query(
    sql`SELECT
          COUNT(a.*) OVER () as total_count,
          a.*, i.meta as user,
          row_to_json(m.*) AS attachment,
          (SELECT
            jsonb_agg(
              json_build_object(
                'id', ans.id, 
                'question_id', ans.question_id, 
                'answer', ans.answer,
                'selected_option', ans.selected_option,
                'created_at', ans.created_at,
                'updated_at', ans.updated_at
              )
            )
            FROM answers ans
            WHERE ans.applicant_id=a.id
          ) AS answers,
          (SELECT
            jsonb_agg(
              json_build_object(
                'id', q.id, 
                'question', q.question, 
                'required', q.required,
                'options', q.options,
                'created_at', q.created_at,
                'updated_at', q.updated_at
              )
            )
            FROM questions q
            WHERE q.project_id=a.project_id
          ) AS questions
        FROM applicants a
        JOIN identities i ON i.id=a.user_id
        LEFT JOIN media m ON m.id=a.attachment
        WHERE 
          a.project_id=${projectId} AND 
          (LENGTH(${q}::text)<1 OR a.search_tsv @@ to_tsquery(${textSearch(q)}))
          ${filtering(filter, filterColumns, true, 'a')}
        ${sorting(sort, sortColumns)}
        LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const owner = async (userId, id) => {
  try {
    return app.db.get(sql`
      SELECT 
        a.*,
        row_to_json(p.*) AS project
      FROM applicants a 
      JOIN projects p ON a.project_id=p.id
      WHERE a.id=${id} and a.user_id=${userId}`)
  } catch {
    throw new PermissionError()
  }
}

export const projectOwner = async (identityId, id) => {
  try {
    return app.db.get(sql`
      SELECT 
        a.*,
        row_to_json(p.*) AS project
      FROM applicants a 
      JOIN projects p ON a.project_id=p.id
      WHERE a.id=${id} AND p.identity_id=${identityId}`)
  } catch {
    throw new PermissionError()
  }
}

export const projectsOwnerOnPending = async (identityId, ids) => {
  try {
    const { rows } = await app.db.query(
      sql`
      SELECT 
        a.*,
        row_to_json(p.*) AS project
      FROM applicants a 
      JOIN projects p ON a.project_id=p.id AND p.identity_id=${identityId}
      WHERE a.id=ANY(${ids}) AND a.status=${StatusTypes.PENDING}
    `
    )
    return rows
  } catch (e) {
    throw new PermissionError()
  }
}

export const search = async (q, identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(*) OVER () as total_count,
      a.id
    FROM applicants a
    JOIN projects p ON p.id=a.project_id
    WHERE
      (a.user_id=${identityId} OR p.identity_id=${identityId}) AND
      a.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns, true, 'a')}
    ${sorting(sort, sortColumns, 'a')}
    LIMIT ${limit} OFFSET ${offset}
    `)

  const orgs = await getAll(
    rows.map((r) => r.id),
    sort
  )

  return orgs.map((r) => {
    return {
      total_count: rows.length > 0 ? rows[0].total_count : 0,
      ...r
    }
  })
}
