import Joi from 'joi';

export const upsertSchem = Joi.object({
  project_id: Joi.string().required(),
  user_id: Joi.string().required(),
  cover_letter: Joi.string(),
  attachment_name: Joi.string(),
  attachment_link: Joi.string(),
  application_status: Joi.number(),
  payment_type: Joi.number(),
  payment_rate: Joi.number(),
  offer_rate: Joi.string(),
  offer_message: Joi.string(),
});