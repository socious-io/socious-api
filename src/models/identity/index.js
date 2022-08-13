import sql from 'sql-template-tag';
import Joi from 'joi';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';
import Org from '../organization/index.js';

const batchSchem = Joi.object({
  ids: Joi.array().items(Joi.string()).max(250).required(),
});

const Types = {
  ORG: 'organizations',
  USER: 'users',
};

const get = async (id) => {
  return app.db.get(sql`SELECT * FROM identities WHERE id=${id}`);
};

const getByIds = async (ids) => {
  const {rows} = await app.db.query(
    sql`SELECT * FROM identities WHERE id = ANY(${ids})`,
  );
  return rows;
};

const getAll = async (body) => {
  await batchSchem.validateAsync(body);
  return getByIds(body.ids);
};

const permissioned = async (identity, userId) => {
  switch (identity.type) {
    case Types.ORG:
      await Org.permissionedMember(identity.id, userId);
      break;
    case Types.USER:
      if (userId !== identity.id) throw new PermissionError('Not allow');
      break;
    default:
      throw new PermissionError('Not allow');
  }
};

export default {
  Types,
  get,
  getAll,
  getByIds,
  permissioned,
};
