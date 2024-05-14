import sql from 'sql-template-tag'
import { EntryError } from '../../utils/errors.js'
import { app } from '../../index.js'

export const create = async (identityId, { title, description, respondent_id, evidences = [] }) => {
  let dispute, disputeEvent
  await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      dispute = await client.query(
        sql`
          INSERT INTO disputes (
            title,
            claimant_id,
            respondent_id
          ) VALUES (
            ${title},
            ${identityId},
            ${respondent_id}
          )
          RETURNING *;
        `
      )
      dispute = dispute.rows[0]

      disputeEvent = await client.query(
        sql`
          INSERT INTO dispute_events(identity_id, dispute_id, message, evidences)
          VALUES (${identityId}, ${dispute.id}, ${description}, ${evidences})
          RETURNING *
        `
      )
      disputeEvent = disputeEvent.rows[0]

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })

  return { dispute, disputeEvent }
}

export const updateDisputeState = async (disputeId, state = 'MESSAGE') => {
  try {
    const { rows } = await app.db.query(
      sql`
          UPDATE disputes
          SET state=${state}
          WHERE id=${disputeId}
          RETURNING *
        `
    )
    return rows[0]
  } catch (err) {
    throw err
  }
}

export const createEventOnDispute = async (
  identityId,
  disputeId,
  { message = null, evidences = [], eventType = 'MESSAGE' },
  { changeState = null } = {}
) => {
  let dispute_event, dispute

  await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      dispute_event = await client.query(
        sql`
            INSERT INTO dispute_events(identity_id, dispute_id, message, evidences, type)
            VALUES (${identityId}, ${disputeId}, ${message}, ${evidences}, ${eventType})
            RETURNING *
          `
      )
      dispute_event = dispute_event.rows[0]

      if (changeState) {
        dispute = await client.query(
          sql`
              UPDATE disputes
              SET state=${changeState}
              WHERE id=${disputeId} AND state='AWAITING_RESPONSE'
              RETURNING *
            `
        )
        dispute = dispute.rows[0]
      }

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })

  return { dispute_event, dispute }
}
