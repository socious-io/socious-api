import Joi from 'joi';
import {SocialCauses} from '../../utils/types.js';

export const usernamePattern =
  /^(?=.{6,24}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export const updateProfileSchem = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  username: Joi.string().regex(usernamePattern).required(),
  bio: Joi.string(),
  city: Joi.string(),
  address: Joi.string(),
  country: Joi.string().min(2).max(3),
  phone: Joi.string(),
  wallet_address: Joi.string(),
  avatar: Joi.string().uuid(),
  cover_image: Joi.string().uuid(),
  social_causes: Joi.array().items(
    Joi.string().valid(...Object.values(SocialCauses)),
  ),
  skills: Joi.array().items(Joi.string()),
});
