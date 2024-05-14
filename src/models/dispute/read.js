import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { sorting, filtering } from '../../utils/query.js'

export const filterColumns = {}

export const sortColumns = ['created_at', 'updated_at', 'state', 'claimant_id', 'respondent_id']

export const all = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(
    sql`SELECT 
    d.id, title, state,
    (CASE WHEN i1.id=${identityId} THEN 'received' ELSE 'submitted' END) AS direction,
    row_to_json(i1.*) AS claimant,
    row_to_json(i2.*) AS respondent,
    jsonb_agg(de.*) as events,
    d.created_at, d.updated_at
    FROM disputes d
    JOIN identities i1 ON i1.id=d.claimant_id
    JOIN identities i2 ON i2.id=d.respondent_id
    CROSS JOIN (
      SELECT de.message, de.vote_side, de.type de.created_at,
      (
        CASE WHEN de.evidences='{}'
        THEN '[]'
        ELSE jsonb_agg(json_build_object(
          'id', m.id,
          'url', m.url
        ))
        END
      ) AS evidences
      FROM dispute_events de
      LEFT JOIN media m ON m.id=ANY(de.evidences)
      JOIN disputes d ON d.id=de.dispute_id AND (claimant_id=${identityId} OR respondent_id=${identityId})
      GROUP BY de.id
    ) de
    WHERE claimant_id=${identityId} OR respondent_id=${identityId}
    GROUP BY d.id, i1.id, i2.id
    ${sorting(sort, sortColumns, 'd')}
    LIMIT ${limit} OFFSET ${offset}`
  )

  return rows
}
