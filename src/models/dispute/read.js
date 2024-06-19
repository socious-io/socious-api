import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { filtering, sorting } from '../../utils/query.js'

export const filterColumns = { direction: String, code: String, title: String, category: String, state: String }
export const invitationFilterColumns = { status: String, dispute_id: String }

export const sortColumns = ['created_at', 'updated_at', 'state', 'claimant_id', 'respondent_id']
export const sortColumnsInvitations = ['created_at', 'updated_at', 'dispute_id']

const createDirectionFiltering = (
  identityId,
  filteredAttribute,
  filters = {
    claimant: true,
    respondent: true,
    juror: true
  }
) => {
  const filtersToQuery = {
    claimant: sql`d.claimant_id=${identityId}`,
    respondent: sql`d.respondent_id=${identityId}`,
    juror: sql`dj.juror_id=${identityId}`
  }

  if (filteredAttribute) {
    filters = {
      claimant: false,
      respondent: false,
      juror: false
    }
    filters[filteredAttribute] = true
  }

  let filterings = sql`( `,
    firstFilter = true
  for (const filter in filters) {
    if (filters[filter]) {
      if (firstFilter) {
        filterings = sql`${filterings} ${filtersToQuery[filter]}`
        firstFilter = false
      } else filterings = sql`${filterings} OR ${filtersToQuery[filter]}`
    }
  }
  filterings = sql`${filterings} )`

  return filterings
}

export const all = async (identityId, { offset = 0, limit = 10, sort, filter }) => {
  const directionToAttribute = {
    submitted: 'claimant',
    received: 'respondent',
    juror: 'juror'
  }
  let customFiltering = createDirectionFiltering(identityId, directionToAttribute[filter.direction])
  if (filter.direction) delete filter.direction

  if (filter.state && filter.state == 'DECISION_SUBMITTED') {
    customFiltering = sql`${customFiltering} AND (dj.juror_id=${identityId} AND dj.vote_side IS NOT NULL)`
    delete filter.state
  }

  const { rows } = await app.db.query(
    sql`
    SELECT d.id, d.title, d.category,
    (
      CASE
        WHEN dj.juror_id=${identityId} AND dj.vote_side IS NOT NULL THEN 'DECISION_SUBMITTED'
        ELSE d.state
        END
    ) AS state,
    code,
    (
      CASE
        WHEN d.claimant_id=${identityId} THEN 'submitted'
        WHEN d.respondent_id=${identityId} THEN 'received'
        ELSE 'juror'
        END
    ) AS direction,
    row_to_json(i1.*) AS claimant,
    row_to_json(i2.*) AS respondent,
    json_build_object(
      'id', m.id,
      'name', p.title
    ) as contract,
    COALESCE(
      (
        SELECT
          json_build_object(
            'voted', COUNT(DISTINCT dj.vote_side),
            'members', COUNT(DISTINCT dj.juror_id)
          )
        FROM dispute_jourors dj
        WHERE dj.dispute_id=d.id
        GROUP BY dj.dispute_id
      ),
      '{"voted":0, "members":0}'
    ) as jury,
    ARRAY (
      SELECT
      json_build_object(
          'id', de.id,
          'creator', de_i.*,
          'message', de.message,
          'type', de.type,
          'evidences', COALESCE(
            json_agg(json_build_object(
            'id', m.id,
            'url', m.url
            )) FILTER (WHERE dev.id IS NOT NULL),
            '[]'
          ),
          'created_at', de.created_at
      )
      FROM dispute_events de
      JOIN identities de_i ON de_i.id=de.identity_id
      LEFT JOIN dispute_evidences dev ON dev.dispute_event_id=de.id
      LEFT JOIN media m ON m.id=dev.media_id
      WHERE de.dispute_id=d.id
      GROUP BY de.id,de_i.id
      ORDER BY de.created_at
    ) as events,
    d.created_at, d.updated_at
    FROM disputes d
    JOIN identities i1 ON i1.id=d.claimant_id
    JOIN identities i2 ON i2.id=d.respondent_id
    LEFT JOIN dispute_jourors dj ON dispute_id=d.id
    JOIN missions m ON mission_id=m.id
    JOIN projects p ON m.project_id=p.id
    WHERE ${customFiltering}
    ${filtering(filter, filterColumns, true, 'd')}
    GROUP BY d.id, i1.id, i2.id, dj.id, m.id, p.id
    ${sorting(sort, sortColumns, 'd')}
    LIMIT ${limit} OFFSET ${offset}`
  )

  return rows
}

export const getByIdentityIdAndId = async (identityId, id) => {
  try {
    return await app.db.get(
      sql`
        SELECT d.id, d.title, d.category,
        (
          CASE
            WHEN dj.juror_id=${identityId} AND dj.vote_side IS NOT NULL AND d.state='PENDING_REVIEW' THEN 'DECISION_SUBMITTED'
            ELSE d.state
            END
        ) AS state,
        code,
        (
          CASE
            WHEN d.claimant_id=${identityId} THEN 'submitted'
            WHEN d.respondent_id=${identityId} THEN 'received'
            ELSE 'juror' END
        ) AS direction,
        row_to_json(i1.*) AS claimant,
        row_to_json(i2.*) AS respondent,
        json_build_object(
          'id', m.id,
          'name', p.title
        ) as contract,
        COALESCE(
          (
            SELECT
              json_build_object(
                'voted', COUNT(DISTINCT dj.vote_side),
                'members', COUNT(DISTINCT dj.juror_id)
              )
            FROM dispute_jourors dj
            WHERE dj.dispute_id=d.id
            GROUP BY dj.dispute_id
          ),
          '{"voted":0, "members":0}'
        ) as jury,
        ARRAY (
          SELECT
          json_build_object(
              'id', de.id,
              'creator', de_i.*,
              'message', de.message,
              'type', de.type,
              'evidences', COALESCE(
                json_agg(json_build_object(
                'id', m.id,
                'url', m.url
                )) FILTER (WHERE dev.id IS NOT NULL),
                '[]'
              ),
              'created_at', de.created_at
          )
          FROM dispute_events de
          JOIN identities de_i ON de_i.id=de.identity_id
          LEFT JOIN dispute_evidences dev ON dev.dispute_event_id=de.id
          LEFT JOIN media m ON m.id=dev.media_id
          WHERE de.dispute_id=d.id
          GROUP BY de.id,de_i.id
          ORDER BY de.created_at
        ) as events,
        d.created_at, d.updated_at
        FROM disputes d
        JOIN identities i1 ON i1.id=d.claimant_id
        JOIN identities i2 ON i2.id=d.respondent_id
        LEFT JOIN dispute_jourors dj ON dispute_id=d.id
        JOIN missions m ON mission_id=m.id
        JOIN projects p ON m.project_id=p.id
        WHERE d.id=${id} AND (claimant_id=${identityId} OR respondent_id=${identityId} OR dj.juror_id=${identityId})
        GROUP BY d.id, i1.id, i2.id, dj.id, m.id, p.id
      `
    )
  } catch (e) {
    throw new PermissionError()
  }
}

export const getPotentialJurors = async (disputeId, { dispute, status = 'JUROR_SELECTION' }) => {
  let { rows } = await app.db.query(sql`
    SELECT u.id
    FROM users u
    JOIN disputes d ON d.id=${disputeId}
    LEFT JOIN dispute_contributor_invitations dci ON dci.contributor_id=u.id AND dci.dispute_id=d.id
    WHERE u.is_contributor=TRUE AND dci.id IS NULL AND d.state=${status} AND u.id!=${dispute.claimant.id} AND u.id!=${dispute.respondent.id}
    ORDER BY RANDOM()
    LIMIT 50
  `)
  rows = rows.map((row) => row.id)
  return rows
}

export const getAllInvitationsIdentityId = async (identityId, { offset = 0, limit = 10, sort, filter }) => {
  const { rows } = await app.db.query(sql`
    SELECT dci.id,
    json_build_object(
      'id', d.id,
      'title', d.title,
      'code', d.code,
      'category', d.category,
      'contract', json_build_object(
        'id', m.id,
        'name', p.title
      )
    ) as dispute,
    dci.status, dci.created_at, dci.updated_at
    FROM dispute_contributor_invitations dci
    JOIN disputes d ON d.id=dci.dispute_id
    JOIN missions m ON d.mission_id=m.id
    JOIN projects p ON m.project_id=p.id
    WHERE dci.contributor_id=${identityId}
    ${filtering(filter, invitationFilterColumns, true, 'dci')}
    ${sorting(sort, sortColumnsInvitations, 'dci')}
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const getInvitationIdentityIdAndId = (identityId, id) => {
  return app.db.get(sql`
    SELECT dci.id,
    json_build_object(
      'id', d.id,
      'title', d.title,
      'code', d.code,
      'category', d.category,
      'contract', json_build_object(
        'id', m.id,
        'name', p.title
      )
    ) as dispute,
    dci.status, dci.created_at, dci.updated_at
    FROM dispute_contributor_invitations dci
    JOIN disputes d ON d.id=dci.dispute_id
    JOIN missions m ON d.mission_id=m.id
    JOIN projects p ON m.project_id=p.id
    WHERE dci.contributor_id=${identityId} AND dci.id=${id}
  `)
}
