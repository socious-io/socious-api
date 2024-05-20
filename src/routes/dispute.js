import Router from '@koa/router'
import Dispute from '../models/dispute/index.js'
import Event from '../services/events/index.js'
import Notif from '../models/notification/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { paginate } from '../utils/middlewares/requests.js'
import { checkIdParams, disputeClimant, disputeRespondent } from '../utils/middlewares/route.js'
import { validate } from '@socious/data'
import { BadRequestError } from '../utils/errors.js'

export const router = new Router()

router.post('/', loginRequired, async (ctx) => {
  const { identity, request } = ctx

  await validate.DisputeSchema.validateAsync(request.body)
  if (request.body.evidences && request.body.evidences.length > 30) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.create(identity.id, request.body)

  //Send Notification to Respondent
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

router.post('/:id/message', loginRequired, checkIdParams, disputeClimant, async (ctx) => {
  const {
    identity,
    request,
    params: { id }
  } = ctx

  await validate.DisputeMessagingSchema.validateAsync(request.body)
  if (request.body.evidences && request.body.evidences.length > 30) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.createEventOnDispute(identity.id, id, request.body)

  //TODO:Send Notification to Respondent
  Event.push(Event.Types.NOTIFICATION, ctx.body.respondent.id, {
    type: Notif.Types.DISPUTE_NEW_MESSAGE,
    refId: ctx.body.id,
    parentId: null,
    identity
  })
})

router.post('/:id/response', loginRequired, checkIdParams, disputeRespondent, async (ctx) => {
  const {
    identity,
    request,
    params: { id }
  } = ctx

  await validate.DisputeMessagingSchema.validateAsync(request.body)
  if (request.body.evidences && request.body.evidences.length > 30) {
    throw new BadRequestError()
  }
  ctx.body = await Dispute.createEventOnDispute(
    identity.id,
    id,
    { ...request.body, eventType: 'RESPONSE' },
    { changeState: 'PENDING_REVIEW' }
  )

  //TODO:Send Notification to Claimant
  Event.push(Event.Types.NOTIFICATION, ctx.body.claimant.id, {
    type: Notif.Types.DISPUTE_NEW_RESPONSE,
    refId: id,
    parentId: null,
    identity
  })
})

router.post('/:id/withdraw', loginRequired, checkIdParams, disputeClimant, async (ctx) => {
  const {
    identity,
    params: { id }
  } = ctx

  ctx.body = await Dispute.createEventOnDispute(
    identity.id,
    id,
    { eventType: 'WITHDRAW' },
    { changeState: 'WITHDRAWN' }
  )
  //TODO:Send Notification to Respondent
  Event.push(Event.Types.NOTIFICATION, ctx.body.respondent.id, {
    type: Notif.Types.DISPUTE_WITHDRAWN, //Notif.Types.DISPUTE_WITHDRAWN
    refId: id,
    parentId: null,
    identity
  })
})
