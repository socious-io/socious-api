import { NotImplementedError } from '../../utils/errors.js'
import Data from '@socious/data'
import Identity from '../../models/identity/index.js'
import { get, all } from './transaction.js'
import * as Card from './card.js'
import * as Escrow from './escrow.js'
import * as Stripe from './stripe.js'
import * as Crypto from './crypto.js'

const amounts = ({ identity, amount, service, paymode = true, verified = true }) => {
  let total = 0
  let fee = amount * Identity.commissionFee(identity, verified)
  if (service === Data.PaymentService.STRIPE && paymode) {
    fee += (fee + amount) * 0.034 + 0.5
  }
  if (paymode) {
    total = amount + fee
  } else {
    total = amount - fee
  }
  return {
    amount,
    fee,
    total
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
  all,
  charge,
  payout,
  amounts
}
