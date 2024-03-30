import Router from '@koa/router'
import { PermissionError } from '../utils/errors.js'
import Applicant from '../models/applicant/index.js'
import Offer from '../models/offer/index.js'
import Mission from '../models/mission/index.js'
import Notif from '../models/notification/index.js'
import Referring from '../models/referring/index.js'
import Event from '../services/events/index.js'
import Payment from '../services/payments/index.js'
import Data from '@socious/data'
import Analytics from '../services/analytics/index.js'

import { loginRequired } from '../utils/middlewares/authorization.js'
import { offerPermission, offerer, recipient, checkIdParams } from '../utils/middlewares/route.js'
import { setEscrowMission } from '../services/payments/escrow.js'

export const router = new Router()

router.get('/:id', loginRequired, checkIdParams, offerPermission, async (ctx) => {
  const offer = await Offer.get(ctx.offer.id)
  let round = offer.currency === Data.PaymentCurrency.JPY ? 1 : 100
  if (offer.payment_mode === Data.PaymentService.CRYPTO) round = 100000

  const orgReferrer = await Referring.get(offer.offerer_id)
  const contributorReferrer = await Referring.get(offer.applicant_id)

  ctx.body = {
    ...offer,
    ...Payment.amounts({
      amount: offer.assignment_total,
      service: offer.payment_mode === Data.PaymentMode.FIAT ? Data.PaymentService.STRIPE : Data.PaymentService.CRYPTO,
      verified: offer.offerer.meta.verified_impact,
      org_referred: orgReferrer?.wallet_address,
      user_referred: contributorReferrer?.wallet_address,
      round
    }),
    org_referrer_wallet: orgReferrer?.wallet_address,
    contributor_referrer_wallet: contributorReferrer?.wallet_address
  }
})

router.post('/:id/withdrawn', loginRequired, checkIdParams, recipient, async (ctx) => {
  ctx.body = Offer.withdrawn(ctx.params.id)
  if (ctx.offer.applicant_id) {
    await Applicant.withdrawn(ctx.offer.applicant_id)
  }

  Analytics.track({
    userId: ctx.user.id,
    event: 'withdrawn_offer',
    meta: ctx.mission
  })
})

router.post('/:id/approve', loginRequired, checkIdParams, recipient, async (ctx) => {
  if (ctx.offer.payment_mode == Data.PaymentMode.CRYPTO && !ctx.user.wallet_address)
    throw new PermissionError('wallet address need to be complete before approve offer')

  ctx.body = Offer.approve(ctx.params.id)
  if (ctx.offer.applicant_id) await Applicant.approve(ctx.offer.applicant_id)

  Event.push(Event.Types.NOTIFICATION, ctx.offer.offerer_id, {
    type: Notif.Types.APPROVED,
    refId: ctx.offer.id,
    parentId: ctx.offer.project_id,
    identity: ctx.identity
  })
})

router.post('/:id/cancel', loginRequired, checkIdParams, offerer, async (ctx) => {
  ctx.body = Offer.cancel(ctx.params.id)
})

router.post('/:id/hire', loginRequired, checkIdParams, offerer, async (ctx) => {
  let escrow

  if (ctx.offer.project.payment_type != Data.ProjectPaymentType.VOLUNTEER) {
    try {
      escrow = await Payment.getOpenEscrow(ctx.offer.id, ctx.offer.assignment_total)
    } catch (err) {
      throw new PermissionError('payment escrow not found')
    }
  }

  if (
    escrow &&
    escrow.amount < ctx.offer.assignment_total &&
    ctx.offer.project.payment_type != Data.ProjectPaymentType.VOLUNTEER
  ) {
    throw new PermissionError()
  }

  ctx.body = await Offer.hire(ctx.params.id)

  const mission = await Mission.insert({
    project_id: ctx.offer.project.id,
    offer_id: ctx.offer.id,
    applicant_id: ctx.offer.applicant_id,
    assignee_id: ctx.offer.recipient_id,
    assigner_id: ctx.identity.id
  })

  if (ctx.offer.project.payment_type != Data.ProjectPaymentType.VOLUNTEER) {
    await setEscrowMission(escrow.id, mission.id)
  }

  Event.push(Event.Types.NOTIFICATION, ctx.offer.recipient_id, {
    type: Notif.Types.HIRED,
    refId: ctx.offer.id,
    parentId: ctx.offer.project_id,
    identity: ctx.identity
  })
})
