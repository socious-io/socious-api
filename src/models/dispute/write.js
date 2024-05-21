import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { getByIdentityIdAndId } from './read.js'
import { EntryError } from '../../utils/errors.js'

export const create = async (identityId, { title, description, respondent_id, evidences = [] }) => {
  let dispute,
    disputeEvent,
    disputeEvidences = []
  return await app.db.with(async (client) => {
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
          INSERT INTO dispute_events(identity_id, dispute_id, message)
          VALUES (${identityId}, ${dispute.id}, ${description})
          RETURNING *
        `
      )
      disputeEvent = disputeEvent.rows[0]

      if (evidences && evidences.length) {
        evidences.forEach((evidence, index) => {
          disputeEvidences.push(
            client.query(
              sql`
                INSERT INTO dispute_evidences(identity_id, dispute_id, dispute_event_id, media_id)
                VALUES (${identityId}, ${dispute.id}, ${disputeEvent.id}, ${evidences[index]})
                RETURNING *
              `
            )
          )
        })
        disputeEvidences = await Promise.all(disputeEvidences)
      }
      await client.query('COMMIT')
      return await getByIdentityIdAndId(identityId, dispute.id)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })
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
    throw new EntryError(err.message)
  }
}

export const createEventOnDispute = async (
  identityId,
  disputeId,
  { message = null, evidences = [], eventType = 'MESSAGE' },
  { changeState = null } = {}
) => {
  let disputeEvent,
    dispute,
    disputeEvidences = []

  return await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      disputeEvent = await client.query(
        sql`
            INSERT INTO dispute_events(identity_id, dispute_id, message, type)
            VALUES (${identityId}, ${disputeId}, ${message}, ${eventType})
            RETURNING *
          `
      )
      disputeEvent = disputeEvent.rows[0]

      if (evidences && evidences.length) {
        evidences.forEach((evidence, index) => {
          disputeEvidences.push(
            client.query(
              sql`
                INSERT INTO dispute_evidences(identity_id, dispute_id, dispute_event_id, media_id)
                VALUES (${identityId}, ${disputeId}, ${disputeEvent.id}, ${evidences[index]})
                RETURNING *
              `
            )
          )
        })
        disputeEvidences = await Promise.all(disputeEvidences)
      }

      if (changeState) {
        dispute = await client.query(
          sql`
              UPDATE disputes
              SET state=${changeState}
              WHERE id=${disputeId}
              RETURNING *
            `
        )
        dispute = dispute.rows[0]
      }

      await client.query('COMMIT')

      return await getByIdentityIdAndId(identityId, disputeId)
    } catch (err) {
      console.log(err)
      await client.query('ROLLBACK')
      throw err
    }
  })
}
