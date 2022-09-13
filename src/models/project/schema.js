import Joi from 'joi';
import {
  PaymentTypes,
  PaymentSchemeTypes,
  StatusTypes,
  RemotePreferenceTypes,
} from './enums.js';

export const upsertSchem = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  country_id: Joi.string(),
  remote_preference: Joi.string()
    .valid(...Object.values(RemotePreferenceTypes))
    .required(),
  payment_type: Joi.string().valid(...Object.values(PaymentTypes)),
  payment_scheme: Joi.string().valid(...Object.values(PaymentSchemeTypes)),
  payment_currency: Joi.string().allow(null),
  payment_range_lower: Joi.string().allow(null),
  payment_range_higher: Joi.string().allow(null),
  experience_level: Joi.number(),
  status: Joi.string().valid(...Object.values(StatusTypes)),
  expires_at: Joi.string().allow(null),
  other_party_id: Joi.string(),
  other_party_title: Joi.string(),
  other_party_url: Joi.string(),
  updated_at: Joi.string(),
});
