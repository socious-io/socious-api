import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const optInContributions = async (identityId) => {
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO contributors (contributor_id)
      VALUES
        (${identityId})
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const leaveOutContributions = async (identityId) => {
  return await app.db.query(sql` DELETE FROM contributors WHERE contributor_id=${identityId}`)
}

const addContributorToDisputeJourors = async (transaction, identityId, disputeId) => {
  return await transaction.query(sql`
      INSERT INTO dispute_jourors (dispute_id, juror_id)
      VALUES (${disputeId}, ${identityId})
    `)
}

export const updateContributionInvitationStatus = async (identityId, invitationId, status) => {
  let contributeInvitation

  return await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      //Updating Invitation
      contributeInvitation = await client.query(
        sql`
        UPDATE contribute_invitations ci
        SET status=${status}
        WHERE contributor_id=${identityId} AND id=${invitationId}
        RETURNING *
      `
      )
      contributeInvitation = contributeInvitation.rows[0]

      if (contributeInvitation && contributeInvitation.status == 'ACCEPTED') {
        if (contributeInvitation.type == 'DISPUTE')
          await addContributorToDisputeJourors(client, identityId, contributeInvitation.refrence_id)
      }
      await client.query('COMMIT')
      return await contributeInvitation
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })
}
