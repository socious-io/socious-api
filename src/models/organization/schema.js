import Joi from 'joi';

import {SocialCauses} from '../../utils/types.js';
import {Type} from './enums.js';

export const upsertSchem = Joi.object({
  name: Joi.string().required(),
  bio: Joi.string(),
  description: Joi.string(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  type: Joi.string().valid(...Object.values(Type)),
  city: Joi.string(),
  address: Joi.string(),
  country: Joi.string().min(2).max(3),
  social_causes: Joi.array().items(
    Joi.string().valid(...Object.values(SocialCauses)),
  ),
  website: Joi.string().uri(),
  mobile_country_code: Joi.string().regex(/^\+[0-9 -]+/),
});
