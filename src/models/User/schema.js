import Joi from 'joi';

export const authSchem = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const registerSchem = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
