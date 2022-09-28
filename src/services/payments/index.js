import {NotImplementedError} from '../../utils/errors.js';
import Data from '@socious/data';
import {get} from './transaction.js';
import * as Stripe from './stripe.js';

const checkout = async (body) => {
  switch (body.service) {
    case 'STRIPE':
      return Stripe.checkout(body);

    default:
      throw new NotImplementedError();
  }
};

const verify = async (trxId) => {
  const trx = await get(trxId);

  switch (trx.service) {
    case Data.PaymentService.STRIPE:
      return Stripe.verify(trx);

    default:
      throw new NotImplementedError();
  }
};

const cancel = async (trxId) => {
  const trx = await get(trxId);

  switch (trx.service) {
    case 'STRIPE':
      return Stripe.cancel(trx);

    default:
      throw new NotImplementedError();
  }
};

export default {
  checkout,
  verify,
  cancel,
};
