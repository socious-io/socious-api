import Config from '../../config.js'
import Data from '@socious/data'
import Stripe from 'stripe'
import logger from '../../utils/logging.js'
import { getCard } from './card.js'
import { create, setCompleteTrx } from './transaction.js'

export const stripe = Stripe(Config.payments.stripe_jp.secret_key)

const stripeAmount = (amount, currency) => {
  switch (currency) {
    case Data.PaymentCurrency.USD:
      amount *= 100
      return Math.floor(amount)
    case Data.PaymentCurrency.JPY:
      return Math.floor(amount)
    default:
      amount *= 100
      return Math.floor(amount)
  }
}

export const charge = async (identityId, body) => {
  let { amount, currency, meta, source, description, transfers } = body
  let card = await getCard(source, identityId)
  if (!currency) currency = Data.PaymentCurrency.USD

  const trx = await create({
    identity_id: identityId,
    amount,
    currency,
    service: Data.PaymentService.STRIPE,
    meta,
    source: card.id
  })

  const fixedAmount = stripeAmount(amount, currency)

  logger.info(
    'Stripe Charge params: ',
    JSON.stringify({
      amount: fixedAmount,
      currency,
      source: card.id,
      customer: card.customer,
      description
    })
  )

  if (transfers.amount) transfers.amount = stripeAmount(transfers.amount, currency)

  const paymentMethods = await stripe.customers.listPaymentMethods(card.customer, { type: 'card' })

  const paymentIntent = await stripe.paymentIntents.create({
    amount: fixedAmount,
    currency: currency,
    customer: card.customer,
    payment_method: paymentMethods.data[0].id,
    application_fee_amount: fixedAmount - transfers.amount,
    on_behalf_of: transfers.destination,
    transfer_data: {
      destination: transfers.destination
    }
  })

  const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id)

  if (confirmedPaymentIntent.status !== 'succeeded') {
    throw Error(`Payment got error with status : ${confirmedPaymentIntent.status}`)
  }

  await setCompleteTrx(trx.id, paymentIntent.id)

  return {
    id: trx.id,
    amount: trx.amount,
    currency: trx.currency
  }
}

export const payout = async ({ description, destination, is_jp }) => {

  const params = {}

  const balance = await stripe.balance.retrieve({ stripeAccount: destination })

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

  return stripe.payouts.create(params, { stripeAccount: destination })
}

export const addCustomer = async ({ email, token }) => {

  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: { token: token }
  })

  const customer = await stripe.customers.create({
    email: email,
    payment_method: paymentMethod.id
  })

  // await s.paymentMethods.attach(paymentMethod.id, { customer: customer.id })

  return customer
}
