import Router from '@koa/router'
import Dispute from '../models/dispute/index.js'
import Event from '../services/events/index.js'
import Notif from '../models/notification/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { paginate } from '../utils/middlewares/requests.js'
import { checkIdParams, dispute } from '../utils/middlewares/route.js'
import { validate } from '@socious/data'
import { BadRequestError, NotFoundError } from '../utils/errors.js'
import moment from 'moment'
import { addHistory } from '../services/impact_points/badges.js'

export const router = new Router()

router.post('/', loginRequired, async (ctx) => {
  const { identity, request } = ctx

  await validate.DisputeSchema.validateAsync(request.body)
  if (request.body.evidences && request.body.evidences.length > 30) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.initiate(identity.id, request.body)

  const { respondent_id } = request.body
  Event.push(Event.Types.NOTIFICATION, respondent_id, {
    type: Notif.Types.DISPUTE_INITIATED,
    refId: ctx.body.id,
    parentId: null,
    identity,
    dispute: {
      title: ctx.body.title,
      code: ctx.body.code,
      expiration: moment(ctx.body.created_at).add(3, 'days').utc(true).format('MMMM D, YYYY h:mm a')
    }
  })
})

router.get('/', loginRequired, paginate, async (ctx) => {
  const { identity } = ctx

  ctx.body = await Dispute.all(identity.id, ctx.paginate)
})

router.get('/invitations', loginRequired, paginate, async (ctx) => {
  const {
    identity: { id }
  } = ctx

  ctx.body = await Dispute.getAllInvitationsIdentityId(id, ctx.paginate)
})

router.get('/categories', (ctx) => {
  ctx.body = {
    items: Dispute.Categories
  }
})

router.get('/:id', loginRequired, dispute, async (ctx) => {
  ctx.body = ctx.dispute
})

router.post('/:id/message', loginRequired, checkIdParams, dispute, async (ctx) => {
  const {
    identity,
    request,
    params: { id }
  } = ctx

  await validate.DisputeMessagingSchema.validateAsync(request.body)
  if ((request.body.evidences && request.body.evidences.length > 30) || ctx.dispute.claimant.id != identity.id) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.dispatchEvent(identity.id, id, request.body)
})

router.post('/:id/response', loginRequired, checkIdParams, dispute, async (ctx) => {
  const {
    identity,
    request,
    params: { id }
  } = ctx

  await validate.DisputeMessagingSchema.validateAsync(request.body)
  if ((request.body.evidences && request.body.evidences.length > 30) || ctx.dispute.respondent.id != identity.id) {
    throw new BadRequestError()
  }
  const isInAwaitingResponseState = ctx.dispute.state == 'AWAITING_RESPONSE'

  //Creating response to dispute
  ctx.body = await Dispute.dispatchEvent(
    identity.id,
    id,
    { ...request.body, eventType: 'RESPONSE' },
    { changeState: isInAwaitingResponseState ? 'JUROR_SELECTION' : null }
  )

  Event.push(Event.Types.NOTIFICATION, ctx.body.claimant.id, {
    type: Notif.Types.DISPUTE_NEW_RESPONSE,
    refId: id,
    parentId: null,
    identity,
    dispute: {
      title: ctx.body.title,
      code: ctx.body.code
    }
  })

  //Sending Invitations
  if (isInAwaitingResponseState) {
    const potentialJurors = await Dispute.getPotentialJurors(id, { dispute: ctx.dispute })
    const contributionInvitations = await Dispute.sendDisputeContributionInvitation(id, potentialJurors)
    for (const contributionInvitation of contributionInvitations) {
      Event.push(Event.Types.NOTIFICATION, contributionInvitation.contributor_id, {
        type: Notif.Types.DISPUTE_JUROR_CONTRIBUTION_INVITED,
        refId: contributionInvitation.id,
        parentId: null,
        identity,
        dispute: {
          title: ctx.body.title,
          code: ctx.body.code
        }
      })
    }
  }
})

router.post('/:id/withdraw', loginRequired, checkIdParams, dispute, async (ctx) => {
  const {
    identity,
    params: { id }
  } = ctx

  if (ctx.dispute.claimant.id != identity.id) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.dispatchEvent(identity.id, id, { eventType: 'WITHDRAW' }, { changeState: 'WITHDRAWN' })
})

router.post('/:id/vote', loginRequired, checkIdParams, dispute, async (ctx) => {
  const {
    identity,
    query: { vote_side },
    dispute
  } = ctx

  if (
    ctx.dispute.direction != 'juror' ||
    (vote_side != 'CLAIMANT' && vote_side != 'RESPONDENT') ||
    dispute.state != 'PENDING_REVIEW'
  ) {
    throw new BadRequestError()
  }

  await Dispute.castVoteOnDispute(dispute.id, identity.id, vote_side)
  ctx.body = await Dispute.getByIdentityIdAndId(identity.id, dispute.id)

  //Calculating impact points to be awarded
  const social_cause = ctx.body.project.social_causes[0]
  await addHistory(identity.id, {
    total_points: 100,
    label: 'dispute',
    social_cause: social_cause ?? null
  })

  if (ctx.body.state == 'CLOSED' && ctx.body.winner_party) {
    const looserPartyIdentityId = ctx.body.winner_party == 'CLAIMANT' ? ctx.body.respondent.id : ctx.body.claimant.id

    Event.push(Event.Types.NOTIFICATION, looserPartyIdentityId, {
      type: Notif.Types.DISPUTE_CLOSED_TO_LOSER_PARTY,
      refId: ctx.body.id,
      parentId: null,
      identity,
      dispute: {
        title: ctx.body.title,
        code: ctx.body.code
      }
    })
  }
})

//Contribution Invitations
router.get('/invitations/:invitation_id', loginRequired, async (ctx) => {
  const {
    identity: { id },
    params: { invitation_id }
  } = ctx
  try {
    ctx.body = await Dispute.getInvitationIdentityIdAndId(id, invitation_id)
  } catch (e) {
    throw new NotFoundError()
  }
})

router.post('/invitations/:invitation_id/accept', loginRequired, async (ctx) => {
  const {
    identity,
    params: { invitation_id }
  } = ctx
  try {
    ctx.body = await Dispute.updateInvitation(identity.id, invitation_id, 'ACCEPTED')

    //In case of all of the jurors has been selected disputes goes into the PENDING_REVIEW state
    const DisputeJurors = await Dispute.getJurors(ctx.body.dispute.id),
      dispute = await Dispute.getByIdentityIdAndId(identity.id, ctx.body.dispute.id)
    if (dispute.state == 'PENDING_REVIEW') {
      DisputeJurors.forEach((disputeJuror) => {
        Event.push(Event.Types.NOTIFICATION, disputeJuror.juror.id, {
          type: Notif.Types.DISPUTE_JUROR_SELECTION_COMPLETED_TO_JURORS,
          refId: dispute.id,
          parentId: null,
          identity,
          dispute: {
            title: dispute.title,
            code: dispute.code
          }
        })
      })

      Event.push(Event.Types.NOTIFICATION, dispute.claimant.id, {
        type: Notif.Types.DISPUTE_JUROR_SELECTION_COMPLETED_TO_PARTIES,
        refId: dispute.id,
        parentId: null,
        identity,
        dispute: {
          title: dispute.title,
          code: dispute.code
        }
      })

      Event.push(Event.Types.NOTIFICATION, dispute.respondent.id, {
        type: Notif.Types.DISPUTE_JUROR_SELECTION_COMPLETED_TO_PARTIES,
        refId: dispute.id,
        parentId: null,
        identity,
        dispute: {
          title: dispute.title,
          code: dispute.code
        }
      })
    }
  } catch (e) {
    throw new NotFoundError()
  }
})

router.post('/invitations/:invitation_id/decline', loginRequired, async (ctx) => {
  const {
    identity: { id },
    params: { invitation_id }
  } = ctx
  try {
    ctx.body = await Dispute.updateInvitation(id, invitation_id, 'DECLINED')
  } catch (e) {
    throw new NotFoundError()
  }
})
