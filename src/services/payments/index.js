import { NotImplementedError } from '../../utils/errors.js'
import Data from '@socious/data'
import { get, all, getOne } from './transaction.js'
import * as Card from './card.js'
import * as Escrow from './escrow.js'
import * as Stripe from './stripe.js'
import * as Crypto from './crypto.js'

const IMPACT_ORG_FEE = 0.02
const IMPACT_USER_FEE = 0.05
const ORG_FEE = 0.03
const USER_FEE = 0.1
const STRIPE_FEE = 0.036
const REFERRED_ORG_FEE_DISCOUNT = 0.5
const REFERRED_USER_FEE_DISCOUNT = 0.5

export const amounts = ({ amount, service, verified = true, org_referred, user_referred, round = 100 }) => {
  var orgFeeRate = verified ? IMPACT_ORG_FEE : ORG_FEE
  var userFeeRate = verified ? IMPACT_USER_FEE : USER_FEE
  if (org_referred) orgFeeRate *= REFERRED_ORG_FEE_DISCOUNT
  if (user_referred) userFeeRate *= REFERRED_USER_FEE_DISCOUNT

  let fee = amount * orgFeeRate
  let stripe_fee = 0

  if (!round || round < 1) round = 1

  if (service === Data.PaymentService.STRIPE) stripe_fee = (fee + amount) * STRIPE_FEE

  const total = Math.ceil((amount + fee + stripe_fee) * round) / round
  const payoutFee = amount * userFeeRate
  const payout = amount - payoutFee

  return {
    amount,
    fee,
    stripe_fee,
    total,
    payout,
    app_fee: fee + payoutFee
  }
}

/**
 * @param {string} identityId
 * @param {import('../../../types/types').IChargeBody} body
 */
const charge = async (identityId, body) => {
  if (!body.currency) body.currency = Data.PaymentCurrency.USD

  switch (body.service) {
    case Data.PaymentService.STRIPE:
      return Stripe.charge(identityId, body)
    case Data.PaymentService.CRYPTO:
      return Crypto.charge(identityId, body)
    default:
      throw new NotImplementedError()
  }
}

const payout = async (service, body) => {
  if (!body.currency) body.currency = Data.PaymentCurrency.USD

  switch (service) {
    case Data.PaymentService.STRIPE:
      return Stripe.payout(body)

    default:
      throw new NotImplementedError()
  }
}

export default {
  stripe: Stripe.stripe,
  ...Card,
  ...Escrow,
  get,
  getOne,
  all,
  charge,
  payout,
  amounts
}
