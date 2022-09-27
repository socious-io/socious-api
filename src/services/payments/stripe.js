import {app} from '../../index.js';
import Config from '../../config.js';
import Data from '@socious/data';
import Stripe from 'stripe';
import {get, create, setTransaction, complete, cancel} from './transaction.js'

const stripe = Stripe(Config.payments.stripe.secret_key);


const stripeAmount = (amount, currency) => {
  switch (currency) {
    case Data.PaymentCurrency.USD:
      amount *= 100
      break
  }

  return amount
}


export const checkout = async ({identity_id, name, description, amount, currency, meta}) => {
  
  amount = stripeAmount(amount)

  const product = await stripe.products.create({
    name, description
  });

  const price = await stripe.prices.create({
    unit_amount: amount,
    currency: currency,
    product: product.id,
  });

  await app.db.query('BEGIN');
  try {

    const trx = await create({identity_id, amount, currency, service: 'STRIPE', meta})

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${Config.payments.success_url}?id=${trx.id}`,
      cancel_url: `${Config.payments.cancel_url}?id=${trx.id}`,
    });

    await setTransaction(trx.id, session.id)
    await app.db.query('COMMIT');

    return session.url

  } catch (err) {
    await app.db.query('ROLLBACK');
    throw err
  }
  
}

export const expire = async (transactionId) => {
  const trx = await get(transactionId)
  await stripe.checkout.sessions.expire(trx.transaction_id);
  await cancel(transactionId)
}

export const verify = async (transactionId) => {
  const trx = await get(transactionId)
  const session = await stripe.checkout.sessions.retrieve(trx.transaction_id);

  const isSuccess = session.payment_status === 'paid' 
    && session.amount_total === trx.amount 
    && session.currency === trx.currency.toLowerCase() 
    && session.status === 'complete'


  if (isSuccess) {
    await complete(trx.id)
  } else {
    await expire(trx.id)
  }
  
  return isSuccess
}
