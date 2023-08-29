import Router from '@koa/router'
import Data, { validate } from '@socious/data'
import { loginRequired } from '../utils/middlewares/authorization.js'
import Payment from '../services/payments/index.js'
import { cryptoUSDRate } from '../services/payments/crypto.js'
import OAuthConnects from '../services/oauth_connects/index.js'
import { checkIdParams, offerer, assignee } from '../utils/middlewares/route.js'
import { paginate } from '../utils/middlewares/requests.js'
import { BadRequestError } from '../utils/errors.js'
import Mission from '../models/mission/index.js'
import { addCustomer } from '../services/payments/stripe.js'

export const router = new Router()

router.post('/cards', loginRequired, async (ctx) => {
  await validate.CardSchema.validateAsync(ctx.request.body)
  const is_jp = ctx.query.is_jp === 'true'

  const customer = await addCustomer({
    email: ctx.identity.meta.email,
    token: ctx.request.body.token,
    is_jp
  })

  ctx.body = await Payment.newCard(ctx.identity.id, {
    ...ctx.request.body,
    customer: customer.id,
    is_jp
  })
})

router.post('/cards/remove/:id', loginRequired, checkIdParams, async (ctx) => {
  await Payment.removeCard(ctx.params.id, ctx.identity.id)
  ctx.body = {
    message: 'success'
  }
})

router.post('/cards/update/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.CardSchema.validateAsync(ctx.request.body)
  const is_jp = ctx.query.is_jp === 'true'

  const customer = await addCustomer({
    email: ctx.identity.meta.email,
    token: ctx.request.body.token,
    is_jp
  })

  ctx.body = await Payment.updateCard(ctx.params.id, ctx.identity.id, {
    ...ctx.request.body,
    customer: customer.id,
    is_jp
  })
})

router.get('/cards', loginRequired, paginate, async (ctx) => {
  ctx.body = await Payment.getCards(ctx.identity.id, ctx.paginate)
})

router.get('/cards/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Payment.getCard(ctx.params.id, ctx.identity.id)
})

router.get('/', loginRequired, paginate, async (ctx) => {
  ctx.body = await Payment.all(ctx.identity.id, ctx.paginate)
})

router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Payment.get(ctx.params.id, ctx.identity.id)
})

router.post('/donate', loginRequired, async (ctx) => {
  await validate.PaymentSchema.validateAsync(ctx.request.body)
  ctx.body = await Payment.charge(ctx.identity.id, ctx.request.body)
})

router.post('/offers/:id', loginRequired, checkIdParams, offerer, async (ctx) => {
  await validate.EscrowSchema.validateAsync(ctx.request.body)
  const service = ctx.request.body.service
  const amount = ctx.offer.assignment_total

  const amounts = Payment.amounts({ identity: ctx.identity, amount, service, paymode: true })
  const transfers = {}
  const is_jp = ctx.offer.currency === 'JPY' ? true : false
  if (service === Data.PaymentService.STRIPE) {
    try {
      const payoutAmounts = Payment.amounts({ identity: ctx.identity, amount, service, paymode: false })
      const profile = await OAuthConnects.profile(ctx.offer.recipient_id, Data.OAuthProviders.STRIPE, { is_jp })
      transfers.amount = payoutAmounts.total
      transfers.destination = profile.mui
    } catch {
      throw new BadRequestError('Recipient has no connected account')
    }
  }

  ctx.body = await Payment.charge(ctx.identity.id, {
    ...ctx.request.body,
    currency: ctx.offer.currency,
    amount: amounts.total,
    description: ctx.offer.project.name,
    transfers,
    is_jp,
    meta: {
      ...ctx.request.body.meta,
      project_name: ctx.offer.project.name,
      project_id: ctx.offer.project.id,
      offer_id: ctx.offer.id
    }
  })

  await Payment.escrow({
    trx_id: ctx.body.id,
    currency: ctx.offer.currency,
    project_id: ctx.offer.project.id,
    offer_id: ctx.offer.id,
    amount
  })
})

router.post('/missions/:id/payout', loginRequired, checkIdParams, assignee, async (ctx) => {
  if (ctx.mission.status !== Data.MissionStatus.CONFIRMED) {
    throw new BadRequestError('Mission complete not approved')
  }

  const mission = await Mission.get(ctx.mission.id)

  const is_jp = mission.offer.currency === 'JPY' ? true : false

  const profile = await OAuthConnects.profile(ctx.identity.id, Data.OAuthProviders.STRIPE, { is_jp })

  if (profile.status !== Data.UserStatusType.ACTIVE) {
    throw new BadRequestError('Stripe account unboarding required')
  }

  const escrow = mission.escrow

  if (escrow.released_at) throw new BadRequestError('Escrow already has been released')

  const amounts = Payment.amounts({
    identity: ctx.identity,
    amount: escrow.amount,
    service: Data.PaymentService.STRIPE,
    paymode: false,
    verified: mission.assigner.meta.verified_impact
  })

  const payout = await Payment.payout(Data.PaymentService.STRIPE, {
    amount: amounts.total,
    currency: escrow.currency,
    destination: profile.mui,
    description: mission.project.description,
    meta: escrow,
    is_jp
  })

  await Payment.releaseEscrow(escrow.id, payout.id)

  ctx.body = {
    message: 'success',
    transaction_id: payout.id
  }
})

router.get('/crypto/rate', async (ctx) => {
  const rate = await cryptoUSDRate(ctx.query.token)

  ctx.body = {
    rate
  }
})
