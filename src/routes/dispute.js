import Router from '@koa/router'
import { loginRequired } from '../utils/middlewares/authorization.js'
import Dispute from '../models/dispute/index.js'
import { paginate } from '../utils/middlewares/requests.js'

export const router = new Router()

router.post('/', loginRequired, async (ctx) => {
  const {
    identity,
    request: { body }
  } = ctx

  ctx.body = await Dispute.create(identity.id, body)
  //TODO:Send Notification to Respondent
})

router.get('/', loginRequired, paginate, async (ctx) => {
  const {
    identity,
    request: { body }
  } = ctx

  ctx.body = await Dispute.all(identity.id, ctx.paginate)
})

router.post('/:dispute_id/message', loginRequired, async (ctx) => {
  const {
    identity,
    request: { body },
    params: { dispute_id }
  } = ctx
  //TODO:check if i am the claimant of this dispute
  ctx.body = await Dispute.createEventOnDispute(identity.id, dispute_id, body)
  //TODO:Send Notification to Respondent
})

router.post('/:dispute_id/response', loginRequired, async (ctx) => {
  const {
    identity,
    request: { body },
    params: { dispute_id }
  } = ctx
  //TODO:check if i am the respondant of this dispute
  ctx.body = await Dispute.createEventOnDispute(
    identity.id,
    dispute_id,
    { ...body, eventType: 'RESPONSE' },
    { changeState: 'PENDING_REVIEW' }
  )
  //TODO:Send Notification to Claimant
})

router.post('/:dispute_id/withdraw', loginRequired, async (ctx) => {
  const {
    identity,
    params: { dispute_id }
  } = ctx
  //TODO:check if i am the claimant of this dispute
  ctx.body = await Dispute.createEventOnDispute(
    identity.id,
    dispute_id,
    { eventType: 'WITHDRAW' },
    { changeState: 'WITHDRAWN' }
  )
  //TODO:Send Notification to Respondent
})
