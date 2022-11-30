import {NotImplementedError} from '../../utils/errors.js';
import Data from '@socious/data';
import {get, all} from './transaction.js';
import * as Card from './card.js';
import * as Escrow from './escrow.js';
import * as Stripe from './stripe.js';

const charge = async (body) => {
  if (!body.currency) body.currency = Data.PaymentCurrency.USD;

  switch (body.service) {
    case 'STRIPE':
      return Stripe.charge(body);

    default:
      throw new NotImplementedError();
  }
};

export default {
  ...Card,
  ...Escrow,
  get,
  all,
  charge,
};
