import sql from 'sql-template-tag';
import Joi from 'joi';

import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

const insertSchem = Joi.object({
  token: Joi.string().required(),
  meta: Joi.object({
    app_version: Joi.string(),
    os: Joi.string().valid('IOS', 'ANDROID', 'WINDOWS', 'WEBAPP'),
    os_version: Joi.string(),
  }).required(),
});

const insert = async (userId, body) => {
  await insertSchem.validateAsync(body);
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO devices (user_id, token, meta)
      VALUES(${userId}, ${body.token}, ${body.meta})
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

const update = async (userId, body) => {
  await insertSchem.validateAsync(body);
  try {
    const {rows} = await app.db.query(sql`
    UPDATE devices 
      SET meta=${body.meta}
    WHERE user_id=${userId} AND token=${body.token}
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

const get = async (id) => {
  return app.db.get(sql`SELECT * FROM devices WHERE id=${id}`);
};

const all = async (userId) => {
  const {rows} = await app.db.query(
    sql`SELECT * FROM devices WHERE user_id=${userId}`,
  );
  return rows;
};

const any = async (userIds) => {
  const {rows} = await app.db.query(
    sql`SELECT * FROM devices WHERE user_id=ANY(${userIds})`,
  );
  return rows;
};

const remove = async (userId, token) => {
  return app.db.query(
    sql`DELETE FROM devices WHERE user_id=${userId} AND token=${token}`,
  );
};

export default {
  insert,
  update,
  get,
  all,
  any,
  remove,
};
