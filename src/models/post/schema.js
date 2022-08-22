import Joi from 'joi';
import {SocialCauses} from '../../utils/types.js';

export const upsertSchem = Joi.object({
  content: Joi.string().required(),
  causes_tags: Joi.array()
    .items(Joi.string().valid(...Object.values(SocialCauses)))
    .required(),
  hashtags: Joi.array().items(Joi.string()),
  identity_tags: Joi.array().items(Joi.string()),
  media: Joi.string().uuid(),
});

export const upsertCommentSchem = Joi.object({
  content: Joi.string().required(),
  reply_id: Joi.string().uuid(),
});
