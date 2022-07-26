import Joi from 'joi';

export const updateProfileSchem = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  bio: Joi.string(),
  city: Joi.string(),
  address: Joi.string(),
  wallet_address: Joi.string(),
});
