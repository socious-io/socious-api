import Joi from 'joi';
import {Types} from './enums.js';

export const newChatSchem = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  type: Joi.string().valid(...Object.values(Types)),
  participants: Joi.array()
    .unique()
    .min(1)
    .max(250)
    .items(Joi.string().uuid())
    .required(),
});

export const updateChatSchem = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  type: Joi.string().valid(...Object.values(Types)),
});

export const messageUpsertSchem = Joi.object({
  text: Joi.string().required(),
  media: Joi.string().uuid(),
});
