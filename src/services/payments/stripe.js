import Config from '../../config.js'
import Data from '@socious/data'
import Stripe from 'stripe'
import logger from '../../utils/logging.js'
import { getCard, responseCard } from './card.js'
import { create, setCompleteTrx } from './transaction.js'

export const stripe = Stripe(Config.payments.stripe.secret_key)

const stripeAmount = (amount, currency) => {
  switch (currency) {
    case Data.PaymentCurrency.USD:
      amount *= 100
      return Math.floor(amount)
    default:
      amount *= 100
      return Math.floor(amount)
  }
}

export const charge = async (identityId, { amount, currency, meta, source, description, transfers, is_jp }) => {
  let card = await getCard(source, identityId)
  if (!currency) currency = Data.PaymentCurrency.USD

  let s = stripe

  if (is_jp) s = Stripe(Config.payments.stripe_jp.secret_key)

  const paymentMethod = await s.paymentMethods.create({
    type: 'card',
    card: {
      number: card.numbers,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      cvc: card.cvc
    }
  })

  // card = await updateCardBrand(card.id, token.card.brand)

  const trx = await create({
    identity_id: identityId,
    amount,
    currency,
    service: Data.PaymentService.STRIPE,
    meta,
    source: card.id
  })

  const fixedAmount = stripeAmount(amount, currency)

  console.log(
    'Stripe Charge params: ',
    JSON.stringify({
      amount: fixedAmount,
      currency,
      source: paymentMethod.id,
      description
    })
  )

  if (transfers.amount) transfers.amount = stripeAmount(transfers.amount, currency)

  const paymentIntent = await s.paymentIntents.create({
    amount: fixedAmount,
    currency: 'usd',
    payment_method_types: ['card'],
    payment_method: paymentMethod.id,
    application_fee_amount: fixedAmount - transfers.amount,
    on_behalf_of: transfers.destination,
    transfer_data: {
      destination: transfers.destination
    }
  })

  const confirmedPaymentIntent = await s.paymentIntents.confirm(paymentIntent.id)

  if (confirmedPaymentIntent.status !== 'succeeded') {
    throw Error(`Payment got error with status : ${confirmedPaymentIntent.status}`)
  }

  await setCompleteTrx(trx.id, paymentIntent.id)

  return {
    id: trx.id,
    amount: trx.amount,
    currency: trx.currency,
    card: responseCard(card)
  }
}

export const payout = async ({ description, destination, is_jp }) => {
  let s = stripe

  if (is_jp) s = Stripe(Config.payments.stripe_jp.secret_key)

  const params = {}

  const balance = await s.balance.retrieve({ stripeAccount: destination })

  for (const available of balance.available) {
    if (available.amount > 0) {
      params.amount = available.amount
      params.currency = available.currency
      break
    }
  }

  if (params.amount < 20) throw new Error('You may still waiting for Stripe pending process')

  logger.info(
    `Stripe payout ->  ${JSON.stringify({
      params,
      description,
      stripeAccount: destination
    })}`
  )

  return s.payouts.create(params, { stripeAccount: destination })
}
