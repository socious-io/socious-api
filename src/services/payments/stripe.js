import Config from '../../config.js'
import Data from '@socious/data'
import Stripe from 'stripe'
import { getCard, responseCard, updateCardBrand } from './card.js'
import { create, setCompleteTrx } from './transaction.js'

export const stripe = Stripe(Config.payments.stripe.secret_key)

const stripeAmount = (amount, currency) => {
  switch (currency) {
    case Data.PaymentCurrency.USD:
      amount *= 100
      break
  }

  return amount
}

export const charge = async (identityId, { amount, currency, meta, source, description }) => {
  let card = getCard(source, identityId)

  const token = await stripe.tokens.create({
    card: {
      number: card.number,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      cvc: card.cvc
    }
  })

  card = await updateCardBrand(card.id, token.card.brand)

  const trx = await create({
    identity_id: identityId,
    amount,
    currency,
    service: Data.PaymentService.STRIPE,
    meta,
    source: card.id
  })

  const charge = await stripe.charges.create({
    amount: stripeAmount(amount, currency),
    currency,
    source: token,
    description
  })

  await setCompleteTrx(trx.id, charge.id)

  return {
    id: trx.id,
    amount: trx.amount,
    currency: trx.currency,
    card: responseCard(card)
  }
}

export const payout = async ({ amount, currency, description, destination }) => {
  return stripe.payouts.create(
    {
      amount: stripeAmount(amount, currency),
      currency,
      description
    },
    { stripeAccount: destination }
  )
}
