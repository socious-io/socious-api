import Joi from 'joi';
import {app} from '../../index.js';

const Types = {
  POSTS: 'posts',
  USERS: 'users',
  RELATED_USERS: 'related_users',
  PROJECTS: 'projects',
  CHATS: 'chats',
};

const typesNeedUser = [Types.USERS, Types.RELATED_USERS];

const searchSchema = Joi.object({
  q: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(Types))
    .required(),
  current_user_id: Joi.string().uuid().required(),
});

const find = async (body, {offset = 0, limit = 10}) => {
  await searchSchema.validateAsync(body);

  const query = body.q.replaceAll(
    /[^\p{Letter}\p{Number}\p{Separator}]/gu,
    ' ',
  );
  const name = `search/${body.type}`;

  const params = [
    `"${query}"`,
    limit,
    offset,
    typesNeedUser.includes(body.type) ? body.current_user_id : undefined,
  ].filter((p) => p !== undefined);

  const {rows} = await app.db.execute(name, ...params);

  return rows;
};

export default {
  Types,
  find,
};
