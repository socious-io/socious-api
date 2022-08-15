import Joi from 'joi';
import {PaymentTypes, PaymentSchemeTypes, StatusTypes} from './enums.js';

export const upsertSchem = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  payment_type: Joi.string().valid(...Object.values(PaymentTypes)),
  payment_scheme: Joi.string().valid(...Object.values(PaymentSchemeTypes)),
  payment_currency: Joi.string().allow(null),
  payment_range_lower: Joi.string().allow(null),
  payment_range_higher: Joi.string().allow(null),
  experience_level: Joi.number(),
  status: Joi.string().valid(...Object.values(StatusTypes)),
});
