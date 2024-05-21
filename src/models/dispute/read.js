import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { sorting } from '../../utils/query.js'

export const filterColumns = {}

export const sortColumns = ['created_at', 'updated_at', 'state', 'claimant_id', 'respondent_id']

export const all = async (identityId, { offset = 0, limit = 10, sort }) => {
  const { rows } = await app.db.query(
    sql`
    SELECT d.id, title, state, code,
    (CASE WHEN d.claimant_id=${identityId} THEN 'submitted' ELSE 'received' END) AS direction,
    row_to_json(i1.*) AS claimant,
    row_to_json(i2.*) AS respondent,
    ARRAY (
      SELECT
      json_build_object(
          'id', de.id,
          'message', de.message,
          'type', de.type,
          'vote_side', de.vote_side,
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
    WHERE claimant_id=${identityId} OR respondent_id=${identityId}
    GROUP BY d.id, i1.id, i2.id
    ${sorting(sort, sortColumns, 'd')}
    LIMIT ${limit} OFFSET ${offset}`
  )

  return rows
}

export const getByIdentityIdAndId = async (identityId, id) => {
  try {
    return await app.db.get(
      sql`
        SELECT d.id, title, state, code,
        (CASE WHEN d.claimant_id=${identityId} THEN 'submitted' ELSE 'received' END) AS direction,
        row_to_json(i1.*) AS claimant,
        row_to_json(i2.*) AS respondent,
        ARRAY (
          SELECT
          json_build_object(
              'id', de.id,
              'message', de.message,
              'type', de.type,
              'vote_side', de.vote_side,
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
        WHERE d.id=${id} AND (claimant_id=${identityId} OR respondent_id=${identityId})
        GROUP BY d.id, i1.id, i2.id
      `
    )
  } catch (e) {
    throw new PermissionError()
  }
}
