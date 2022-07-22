import Joi from 'joi';

const usernamePattern =
  /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

const phonePattern = /^((\+)?\d{1,3}[- ]?)?\d{10}$/;

export const authSchem = Joi.object({
  username: Joi.string().regex(usernamePattern).required(),
  password: Joi.string().min(8).required(),
});

export const registerSchem = Joi.object({
  username: Joi.string().regex(usernamePattern).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const newOTPSchem = Joi.alternatives().try(
  Joi.object().keys({
    phone: Joi.string().regex(phonePattern).required(),
    email: Joi.string().email(),
  }),
  Joi.object().keys({
    phone: Joi.string().regex(phonePattern),
    email: Joi.string().email().required(),
  }),
);
