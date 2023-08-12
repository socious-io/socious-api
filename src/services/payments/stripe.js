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

export const charge = async (identityId, { amount, currency, meta, source, description, transfers }) => {
  let card = await getCard(source, identityId)

  currency = Data.PaymentCurrency.USD

  console.log('Stripe token card: ', card)

  const paymentMethod = await stripe.paymentMethods.create({
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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd',
    payment_method_types: ['card'],
    payment_method: paymentMethod.id,
    transfer_data: transfers
  })

  const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id)

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

export const payout = async ({ amount, currency, description, destination }) => {
  logger.info(
    `Stripe payout ->  ${JSON.stringify({
      amount: stripeAmount(amount, currency),
      currency,
      description,
      stripeAccount: destination
    })}`
  )

  return stripe.transfers.create({
    amount: stripeAmount(amount, currency),
    currency,
    description,
    destination,
    transfer_group: 'RELEASE_ESCROW'
  })
}
