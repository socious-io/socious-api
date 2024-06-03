import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { sorting } from '../../utils/query.js'

export const filterColumns = {}

export const sortColumns = ['created_at', 'updated_at', 'state', 'claimant_id', 'respondent_id']
export const sortColumnsInvitations = ['created_at', 'updated_at', 'dispute_id']

export const all = async (identityId, { offset = 0, limit = 10, sort }) => {
  const { rows } = await app.db.query(
    sql`
    SELECT d.id, title,
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
          'message', de.message,
          'type', de.type,
          'evidences', COALESCE(
                  json_agg(json_build_object(
                  'id', m.id,
                  'url', m.url
                  )) FILTER (WHERE dev.id IS NOT NULL),
                  '[]'
              )
      )
      FROM dispute_events de
      LEFT JOIN dispute_evidences dev ON dev.dispute_event_id=de.id
      LEFT JOIN media m ON m.id=dev.media_id
      WHERE de.dispute_id=d.id
      GROUP BY de.id
      ORDER BY de.created_at
    ) as events,
    d.created_at, d.updated_at
    FROM disputes d
    JOIN identities i1 ON i1.id=d.claimant_id
    JOIN identities i2 ON i2.id=d.respondent_id
    LEFT JOIN dispute_jourors dj ON dispute_id=d.id
    WHERE claimant_id=${identityId} OR respondent_id=${identityId} OR dj.juror_id=${identityId}
    GROUP BY d.id, i1.id, i2.id, dj.id
    ${sorting(sort, sortColumns, 'd')}
    LIMIT ${limit} OFFSET ${offset}`
  )

  return rows
}

export const getByIdentityIdAndId = async (identityId, id) => {
  try {
    return await app.db.get(
      sql`
        SELECT d.id, title, 
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
            ELSE 'juror' END
        ) AS direction,
        row_to_json(i1.*) AS claimant,
        row_to_json(i2.*) AS respondent,
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
              'message', de.message,
              'type', de.type,
              'evidences', COALESCE(
                      json_agg(json_build_object(
                      'id', m.id,
                      'url', m.url
                      )) FILTER (WHERE dev.id IS NOT NULL),
                      '[]'
                  )
          )
          FROM dispute_events de
          LEFT JOIN dispute_evidences dev ON dev.dispute_event_id=de.id
          LEFT JOIN media m ON m.id=dev.media_id
          WHERE de.dispute_id=d.id
          GROUP BY de.id
          ORDER BY de.created_at
        ) as events,
        d.created_at, d.updated_at
        FROM disputes d
        JOIN identities i1 ON i1.id=d.claimant_id
        JOIN identities i2 ON i2.id=d.respondent_id
        LEFT JOIN dispute_jourors dj ON dispute_id=d.id
        WHERE d.id=${id} AND (claimant_id=${identityId} OR respondent_id=${identityId} OR dj.juror_id=${identityId})
        GROUP BY d.id, i1.id, i2.id, dj.id
      `
    )
  } catch (e) {
    throw new PermissionError()
  }
}

export const getAllInvitationsIdentityId = async (identityId, { offset = 0, limit = 10, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT id, dispute_id, status, created_at, updated_at
    FROM dispute_contributor_invitations dci
    WHERE contributor_id=${identityId}
    ${sorting(sort, sortColumnsInvitations, 'dci')}
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const getInvitationIdentityIdAndId = (identityId, id) => {
  return app.db.get(sql`
    SELECT id, dispute_id, status, created_at, updated_at
    FROM dispute_contributor_invitations dci
    WHERE contributor_id=${identityId} AND id=${id}
  `)
}
