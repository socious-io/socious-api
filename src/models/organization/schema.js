import {Type} from './enums.js';
import Joi from 'joi';

export const upsertSchem = Joi.object({
  name: Joi.string().required(),
  bio: Joi.string(),
  description: Joi.string(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  type: Joi.string().valid(...Object.values(Type)),
  city: Joi.string(),
  address: Joi.string(),
  website: Joi.string().uri(),
});
