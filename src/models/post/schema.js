import Joi from 'joi';

export const upsertSchem = Joi.object({
  content: Joi.string(),
});
