import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { getByIdentityIdAndId, getInvitationIdentityIdAndId } from './read.js'
import { EntryError } from '../../utils/errors.js'

//Create a "dispute"
const create = async (title, identityId, respondentId, missionId, category, { transaction }) => {
  const client = transaction ?? app.db
  const dispute = await client.query(
    sql`
      INSERT INTO disputes (
        title,
        claimant_id,
        respondent_id,
        mission_id,
        category
      ) VALUES (
        ${title},
        ${identityId},
        ${respondentId},
        ${missionId},
        ${category}
      )
      RETURNING *;
    `
  )
  return dispute.rows[0]
}

const createEvidences = async (identityId, disputeId, disputeEventId, evidences, { transaction }) => {
  const client = transaction ?? app.db
  let disputeEvidences = []
  if (evidences && evidences.length) {
    evidences.forEach((evidence) => {
      disputeEvidences.push(
        client.query(
          sql`
            INSERT INTO dispute_evidences(identity_id, dispute_id, dispute_event_id, media_id)
            VALUES (${identityId}, ${disputeId}, ${disputeEventId}, ${evidence})
            RETURNING *
          `
        )
      )
    })
    disputeEvidences = await Promise.all(disputeEvidences)
  }
  return disputeEvidences
}

const updateDisputeState = async (disputeId, state = 'MESSAGE', { transaction }) => {
  const client = transaction ?? app.db
  try {
    const { rows } = await client.query(
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

//TODO: merge with createEventOnDispute
const createEvent = async (identityId, disputeId, message, { eventType = 'MESSAGE', transaction }) => {
  const client = transaction ?? app.db
  let disputeEvent = await client.query(
    sql`
      INSERT INTO dispute_events(identity_id, dispute_id, message, type)
      VALUES (${identityId}, ${disputeId}, ${message}, ${eventType})
      RETURNING *
    `
  )
  return disputeEvent.rows[0]
}

//Get status count of the "dispute contribution invitations" by dispute id aggregated by status type
const getInvitationCountGroupedByStatus = async (disputeId, { transaction }) => {
  const client = transaction ?? app.db
  const contributeInvitationsAggregation = await client.query(
    sql`
    SELECT status, COUNT(dci.id)::int
    FROM dispute_contributor_invitations dci
    WHERE dispute_id=${disputeId}
    GROUP BY status
  `
  )
  return contributeInvitationsAggregation.rows
}

//Get vote count of the "dispute jurors" by dispute id aggregated by vote_side
const getJurorCountGroupedByVoteside = async (disputeId, { transaction = null } = {}) => {
  const client = transaction ?? app.db
  const jurorVotesideAggregation = await client.query(
    sql`
    SELECT vote_side, COUNT(dj.id)::int
    FROM dispute_jourors dj
    WHERE dispute_id=${disputeId}
    GROUP BY vote_side
  `
  )
  return jurorVotesideAggregation.rows
}

//Get "dispute jurors" by dispute id
export const getJurors = async (disputeId, { transaction = null } = {}) => {
  const client = transaction ?? app.db
  const jurors = await client.query(
    sql`
    SELECT *, row_to_json(u) as juror
    FROM dispute_jourors dj
    JOIN users u ON u.id=dj.juror_id
    WHERE dispute_id=${disputeId}
  `
  )
  return jurors.rows
}

//Delete the "dispute contribution invitations" that are not accepted
const deleteRedudantInvitations = async (disputeId, { transaction }) => {
  const client = transaction ?? app.db
  await client.query(
    sql`
    DELETE
    FROM dispute_contributor_invitations dci
    WHERE dispute_id=${disputeId} AND status!='ACCEPTED'
  `
  )
}

//Update a "dispute contribution invitation"
const updateInvitationStatus = async (identityId, invitationId, status, { transaction }) => {
  const client = transaction ?? app.db
  const contributeInvitation = await client.query(
    sql`
    UPDATE dispute_contributor_invitations dci
    SET status=${status}
    WHERE contributor_id=${identityId} AND id=${invitationId}
    RETURNING id, dispute_id, status,  created_at, updated_at
  `
  )

  return contributeInvitation.rows[0]
}

//Add a "identity" to a "dispute jurors"
const addJurorToDispute = async (identityId, disputeId, { transaction }) => {
  const client = transaction ?? app.db
  const juror = await client.query(sql`
    INSERT INTO dispute_jourors (juror_id, dispute_id)
    VALUES (${identityId}, ${disputeId})
  `)

  return juror.rows[0]
}

//Initiate a "dispute" with a "dispute event"
//"description" treated as a event with "MESSAGE" type and text as description that will attach after the creation of the dispute
export const initiate = async (
  identityId,
  { title, description, respondent_id, evidences = [], category = 'OTHERS', mission_id }
) => {
  let dispute, disputeEvent
  return await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      dispute = await create(title, identityId, respondent_id, mission_id, category, { transaction: client })
      disputeEvent = await createEvent(identityId, dispute.id, description, { transaction: client })
      await createEvidences(identityId, dispute.id, disputeEvent.id, evidences, {
        transaction: client
      })
      await client.query('COMMIT')
      return await getByIdentityIdAndId(identityId, dispute.id)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })
}

export const dispatchEvent = async (
  identityId,
  disputeId,
  { message = null, evidences = [], eventType = 'MESSAGE' },
  { changeState = null } = {}
) => {
  let disputeEvent

  return await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      disputeEvent = await createEvent(identityId, disputeId, message, { eventType, transaction: client })
      await createEvidences(identityId, disputeId, disputeEvent.id, evidences, {
        transaction: client
      })
      if (changeState) await updateDisputeState(disputeId, changeState, { transaction: client })

      await client.query('COMMIT')
      return await getByIdentityIdAndId(identityId, disputeId)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })
}

//TODO: Change usage name
export const updateInvitation = async (identityId, invitationId, status) => {
  return await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      //Updating Invitation
      const contributeInvitation = await updateInvitationStatus(identityId, invitationId, status, {
        transaction: client
      })

      if (contributeInvitation && contributeInvitation.status == 'ACCEPTED')
        await addJurorToDispute(identityId, contributeInvitation.dispute_id, { transaction: client })

      const contributeInvitationsAggregation = (
        await getInvitationCountGroupedByStatus(contributeInvitation.dispute_id, { transaction: client })
      ).reduce((pv, cv) => {
        return {
          ...pv,
          [cv.status]: cv.count
        }
      }, {})

      //TODO: Handle race condition
      const { ACCEPTED, INVITED } = contributeInvitationsAggregation // + DECLINED, EXPIRED
      if (ACCEPTED && ACCEPTED >= 3) {
        await updateDisputeState(contributeInvitation.dispute_id, 'PENDING_REVIEW', { transaction: client })
        await deleteRedudantInvitations(contributeInvitation.dispute_id, { transaction: client })
      } else if (!INVITED || (INVITED && INVITED + ACCEPTED < 3)) {
        await updateDisputeState(contributeInvitation.dispute_id, 'JUROR_RESELECTION', { transaction: client })
        //TODO: Reselect Jury?
      } else {
        await updateDisputeState(contributeInvitation.dispute_id, 'JUROR_SELECTION', { transaction: client })
      }
      console.log(ACCEPTED, INVITED)
      await client.query('COMMIT') //TODO: check for locking the respective rows

      return await getInvitationIdentityIdAndId(identityId, invitationId)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })
}

export const castVoteOnDispute = async (id, identityId, voteSide) => {
  return await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      //TODO: Handle race conditions
      const { rows } = await client.query(
        sql`
          UPDATE dispute_jourors dj
          SET vote_side=${voteSide}
          WHERE dispute_id=${id} AND juror_id=${identityId}
          RETURNING *
        `
      )

      const {
        CLAIMANT = 0,
        RESPONDENT = 0,
        total
      } = (await getJurorCountGroupedByVoteside(id, { transaction: client })).reduce(
        (pv, cv) => {
          pv.total += cv.count
          return {
            ...pv,
            [cv.vote_side]: cv.count
          }
        },
        {
          total: 0
        }
      )

      if (CLAIMANT + RESPONDENT == total) {
        //There's no NULL vote remaining
        //CAUTION: equal condition is not specified!
        let winnerParty = null
        if (CLAIMANT < RESPONDENT) winnerParty = 'RESPONDENT'
        else if (CLAIMANT > RESPONDENT) winnerParty = 'CLAIMANT'
        await client.query(
          sql`
            UPDATE disputes d
            SET state='CLOSED', winner_party=${winnerParty}
            WHERE id=${id}
            RETURNING *
          `
        )
      }
      // else -> there's still a NULL vote

      await client.query('COMMIT')
      return rows[0]
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })
}

export const sendDisputeContributionInvitation = async (disputeId, userIds) => {
  const invitations = []
  try {
    for (const userId of userIds) {
      const { rows } = await app.db.query(
        sql`
          INSERT INTO dispute_contributor_invitations (
              contributor_id,
              dispute_id
            ) VALUES (
              ${userId},
              ${disputeId}
            )
          RETURNING *;
        `
      )
      invitations.push(rows[0])
    }
    return invitations
  } catch (err) {
    new EntryError(err.message)
  }
}
