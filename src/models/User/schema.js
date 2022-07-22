import Joi from 'joi';

const usernamePattern =
  /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export const authSchem = Joi.object({
  username: Joi.string().regex(usernamePattern).required(),
  password: Joi.string().min(8).required(),
});

export const registerSchem = Joi.object({
  username: Joi.string().regex(usernamePattern).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
