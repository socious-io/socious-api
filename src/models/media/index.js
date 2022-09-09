import Joi from 'joi';
import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

const insert = async (identityId, filename, url) => {
  await Joi.string().uuid().validateAsync(identityId);
  try {
    const {rows} = await app.db.query(sql`
      INSERT INTO media (identity_id, filename, url)
        VALUES (${identityId}, ${filename}, ${url})
        RETURNING *
      `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

const get = async (id) => {
  await Joi.string().uuid().validateAsync(id);
  return app.db.get(sql`SELECT * FROM media WHERE id=${id}`);
};

const getAll = async (ids) => {
  await Joi.array().items(Joi.string().uuid()).validateAsync(ids);
  return app.db.get(sql`SELECT * FROM media WHERE id=ANY(${ids})`);
};

export default {
  insert,
  get,
  getAll,
};
