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
  country: Joi.string().min(2).max(3),
  expires_at: Joi.string().allow(null),
  other_party_id: Joi.string(),
  other_party_title: Joi.string(),
  other_party_url: Joi.string(),
  updated_at: Joi.string(),
});

export const questionSchema = Joi.object({
  question: Joi.string().required(),
  required: Joi.boolean(),
  options: Joi.array().min(2).max(5).items(Joi.string()),
});
