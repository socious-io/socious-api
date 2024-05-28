import Router from '@koa/router'
import Dispute from '../models/dispute/index.js'
import Event from '../services/events/index.js'
import Notif from '../models/notification/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { paginate } from '../utils/middlewares/requests.js'
import { checkIdParams, dispute } from '../utils/middlewares/route.js'
import { validate } from '@socious/data'
import { BadRequestError, NotFoundError } from '../utils/errors.js'

export const router = new Router()

router.post('/', loginRequired, async (ctx) => {
  const { identity, request } = ctx

  await validate.DisputeSchema.validateAsync(request.body)
  if (request.body.evidences && request.body.evidences.length > 30) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.create(identity.id, request.body)

  const { respondent_id } = request.body
  Event.push(Event.Types.NOTIFICATION, respondent_id, {
    type: Notif.Types.DISPUTE_INITIATED,
    refId: ctx.body.id,
    parentId: null,
    identity
  })
})

router.get('/', loginRequired, paginate, async (ctx) => {
  const { identity } = ctx

  ctx.body = await Dispute.all(identity.id, ctx.paginate)
})

router.get('/invitations', loginRequired, async (ctx) => {
  const {
    identity: { id }
  } = ctx

  try {
    ctx.body = await Dispute.getAllInvitationsIdentityId(id)
  } catch (e) {
    console.log(e)
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
  console.log(ctx.dispute.claimant.id, identity.id)
  if ((request.body.evidences && request.body.evidences.length > 30) || ctx.dispute.claimant.id != identity.id) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.createEventOnDispute(identity.id, id, request.body)

  Event.push(Event.Types.NOTIFICATION, ctx.body.respondent.id, {
    type: Notif.Types.DISPUTE_NEW_MESSAGE,
    refId: ctx.body.id,
    parentId: null,
    identity
  })
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
  ctx.body = await Dispute.createEventOnDispute(
    identity.id,
    id,
    { ...request.body, eventType: 'RESPONSE' },
    { changeState: 'PENDING_REVIEW' }
  )

  Event.push(Event.Types.NOTIFICATION, ctx.body.claimant.id, {
    type: Notif.Types.DISPUTE_NEW_RESPONSE,
    refId: id,
    parentId: null,
    identity
  })
})

router.post('/:id/withdraw', loginRequired, checkIdParams, dispute, async (ctx) => {
  const {
    identity,
    params: { id }
  } = ctx

  if (ctx.dispute.claimant.id != identity.id) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.createEventOnDispute(
    identity.id,
    id,
    { eventType: 'WITHDRAW' },
    { changeState: 'WITHDRAWN' }
  )

  Event.push(Event.Types.NOTIFICATION, ctx.body.respondent.id, {
    type: Notif.Types.DISPUTE_WITHDRAWN, //Notif.Types.DISPUTE_WITHDRAWN
    refId: id,
    parentId: null,
    identity
  })
})

router.post('/:id/vote', loginRequired, checkIdParams, dispute, async (ctx) => {
  const {
    identity,
    query: { vote_side },
    dispute
  } = ctx

  if (ctx.dispute.direction != 'juror' || (vote_side != 'CLAIMANT' && vote_side != 'RESPONDENT')) {
    throw new BadRequestError()
  }

  await Dispute.castVoteOnDispute(dispute.id, identity.id, vote_side)
  ctx.body = await Dispute.getByIdentityIdAndId(identity.id, dispute.id)
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
    identity: { id },
    params: { invitation_id }
  } = ctx
  try {
    ctx.body = await Dispute.updateInvitationStatus(id, invitation_id, 'ACCEPTED')
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
    ctx.body = await Dispute.updateInvitationStatus(id, invitation_id, 'DECLINED')
  } catch (e) {
    throw new NotFoundError()
  }
})
