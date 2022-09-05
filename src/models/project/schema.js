import Joi from 'joi';
import {
  PaymentTypes,
  PaymentSchemeTypes,
  StatusTypes,
  RemotePreferenceTypes,
  ProjectTypes,
  ProjectLengthTypes,
} from './enums.js';

import {SocialCauses} from '../../utils/types.js';

export const upsertSchem = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
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
  project_type: Joi.string().valid(...Object.values(ProjectTypes)),
  project_length: Joi.string().valid(...Object.values(ProjectLengthTypes)),
  skills: Joi.array().items(Joi.string()),
  causes_tags: Joi.array().items(
    Joi.string().valid(...Object.values(SocialCauses)),
  ),
  country: Joi.string().min(2).max(3)
});
