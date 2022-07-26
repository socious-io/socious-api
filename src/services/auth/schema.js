import Joi from 'joi';

const usernamePattern =
  /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

const phonePattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export const authSchem = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const registerSchem = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
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

export const confirmOTPSchem = Joi.alternatives().try(
  Joi.object().keys({
    code: Joi.string().min(6).max(6),
    phone: Joi.string().regex(phonePattern).required(),
    email: Joi.string().email(),
  }),
  Joi.object().keys({
    code: Joi.string().min(6).max(6),
    phone: Joi.string().regex(phonePattern),
    email: Joi.string().email().required(),
  }),
);

export const changePasswordSchem = Joi.object({
  current_password: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const directChangePasswordSchem = Joi.object({
  password: Joi.string().min(8).required(),
});
