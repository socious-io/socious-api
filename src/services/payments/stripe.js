import {app} from '../../index.js';
import Config from '../../config.js';
import Data from '@socious/data';
import Stripe from 'stripe';
import {create, setTransaction, complete, cancel} from './transaction.js';
import {PermissionError} from '../../utils/errors.js';

const stripe = Stripe(Config.payments.stripe.secret_key);

const stripeAmount = (amount, currency) => {
  switch (currency) {
    case Data.PaymentCurrency.USD:
      amount *= 100;
      break;
  }

  return amount;
};

export const checkout = async ({
  identity_id,
  name,
  description,
  amount,
  currency,
  meta,
  callback,
}) => {
  const product = await stripe.products.create({
    name,
    description,
  });

  const price = await stripe.prices.create({
    unit_amount: stripeAmount(amount),
    currency: currency,
    product: product.id,
  });

  await app.db.query('BEGIN');
  try {
    const trx = await create({
      identity_id,
      amount,
      currency,
      service: Data.PaymentService.STRIPE,
      meta,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${callback}?id=${trx.id}&status=success`,
      cancel_url: `${callback}?id=${trx.id}&status=cancel`,
    });

    await setTransaction(trx.id, session.id);
    await app.db.query('COMMIT');

    return {
      id: trx.id,
      amount: trx.amount,
      currency: trx.currency,
      url: session.url,
    };
  } catch (err) {
    await app.db.query('ROLLBACK');
    throw err;
  }
};

export const expire = async (trx) => {
  await stripe.checkout.sessions.expire(trx.transaction_id);
  await cancel(trx.id);
};

export const verify = async (trx) => {
  if (trx.verified_at) throw new PermissionError();

  const session = await stripe.checkout.sessions.retrieve(trx.transaction_id);

  const isSuccess =
    session.payment_status === 'paid' &&
    session.amount_total === trx.amount &&
    session.currency === trx.currency.toLowerCase() &&
    session.status === 'complete';

  if (isSuccess) {
    await complete(trx.id);
  } else {
    await expire(trx.id);
  }

  return isSuccess;
};
