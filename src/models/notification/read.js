import Joi from 'joi';
import sql from 'sql-template-tag';
import {app} from '../../index.js';

// TODO: we can add filters
export const all = async (userId, {offset = 0, limit = 10}) => {
  await Joi.string().uuid().validateAsync(userId);
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, *
    FROM notifications WHERE user_id=${userId}
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const allUnreads = async (userId, {offset = 0, limit = 10}) => {
  await Joi.string().uuid().validateAsync(userId);
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, *
    FROM notifications WHERE user_id=${userId} AND read_at IS NULL
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const get = async (userId, id) => {
  await Joi.string().uuid().validateAsync(userId);
  await Joi.string().uuid().validateAsync(id);
  return app.db.get(sql`
    SELECT * FROM notifications WHERE id=${id} AND user_id=${userId}
  `);
};
