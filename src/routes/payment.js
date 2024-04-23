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
import Referring from '../models/referring/index.js'
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
  ctx.body = await Payment.getOne(ctx.params.id, ctx.identity.id)
})

router.post('/donate', loginRequired, async (ctx) => {
  await validate.PaymentSchema.validateAsync(ctx.request.body)
  ctx.body = await Payment.charge(ctx.identity.id, ctx.request.body)
})

router.post('/offers/:id', loginRequired, checkIdParams, offerer, async (ctx) => {
  await validate.EscrowSchema.validateAsync(ctx.request.body)
  const service = ctx.request.body.service
  const amount = ctx.offer.assignment_total

  const is_jp = ctx.offer.currency === Data.PaymentCurrency.JPY ? true : false

  let round = is_jp ? 1 : 100

  if (service === Data.PaymentService.CRYPTO) round = 100000

  const orgReferrer = await Referring.get(ctx.offer.offerer_id)
  const userReferrer = await Referring.get(ctx.offer.recipient_id)

  const amounts = Payment.amounts({
    amount,
    service,
    verified: ctx.identity.meta.verified_impact,
    org_referred: orgReferrer?.wallet_address,
    user_referred: userReferrer?.wallet_address,
    round: round
  })

  const transfers = {}
  if (service === Data.PaymentService.STRIPE) {
    try {
      const profile = await OAuthConnects.profile(ctx.offer.recipient_id, Data.OAuthProviders.STRIPE, { is_jp })
      transfers.amount = amounts.payout
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
    org_referrer: orgReferrer?.referred_by_id,
    user_referrer: userReferrer?.referred_by_id,
    fee: amounts.fee,
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

  const is_jp = mission.offer.currency === Data.PaymentCurrency.JPY ? true : false

  const profile = await OAuthConnects.profile(ctx.identity.id, Data.OAuthProviders.STRIPE, { is_jp })

  if (profile.status !== Data.UserStatusType.ACTIVE) {
    throw new BadRequestError('Stripe account unboarding required')
  }

  const escrow = mission.escrow

  if (escrow.released_at) throw new BadRequestError('Escrow already has been released')

  let round = is_jp ? 1 : 100
  if (mission.offer.payment_mode === Data.PaymentService.CRYPTO) round = 100000

  const orgReferrer = await Referring.get(mission.offer.offerer_id)
  const contributorReferrer = await Referring.get(mission.offer.applicant_id)

  const amounts = Payment.amounts({
    amount: escrow.amount,
    service: Data.PaymentService.STRIPE,
    verified: mission.assigner.meta.verified_impact,
    org_referred: orgReferrer?.wallet_address,
    user_referred: contributorReferrer?.wallet_address,
    round
  })

  const payout = await Payment.payout(Data.PaymentService.STRIPE, {
    amount: amounts.payout,
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
