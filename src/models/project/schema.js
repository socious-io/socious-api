import Joi from 'joi';

export const upsertSchem = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  country_id: Joi.number().allow(null),
  payment_type: Joi.number(),
  payment_scheme: Joi.number(),
  payment_currency: Joi.string().allow(null),
  payment_range_lower: Joi.string().allow(null),
  payment_range_higher: Joi.string().allow(null),
  experience_level: Joi.number(),
  project_status: Joi.number(),
});
