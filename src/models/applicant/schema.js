import Joi from 'joi';

export const upsertSchem = Joi.object({
  cover_letter: Joi.string().required(),
  payment_type: Joi.number(),
  payment_rate: Joi.number(),
});

export const offerSchem = Joi.object({
  offer_rate: Joi.string().required(),
  offer_message: Joi.string().required(),
  due_date: Joi.string().isoDate(),
  assignment_total: Joi.number(),
});

export const rejectSchem = Joi.object({
  feedback: Joi.string(),
});
