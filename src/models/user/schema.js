import Joi from 'joi';
import {SocialCauses} from '../../utils/types.js';

export const updateProfileSchem = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  bio: Joi.string(),
  city: Joi.string(),
  address: Joi.string(),
  wallet_address: Joi.string(),
  avatar: Joi.string().uuid(),
  cover_image: Joi.string().uuid(),
  social_causes: Joi.array().items(
    Joi.string().valid(...Object.values(SocialCauses)),
  ),
  skills: Joi.array().items(Joi.string()),
});
