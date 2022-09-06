import Joi from 'joi';

export const answerSchema = Joi.object({
  id: Joi.string().uuid().required(),
  answer: Joi.string(),
  selected_option: Joi.number().min(1).max(5),
});

export const upsertSchem = Joi.object({
  cover_letter: Joi.string().required(),
  payment_type: Joi.number(),
  payment_rate: Joi.number(),
  answers: Joi.array().items(answerSchema),
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
