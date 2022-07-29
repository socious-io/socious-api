import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';
import Org from '../organization/index.js';

const Types = {
  ORG: 'organizations',
  USER: 'users',
};

const get = async (id) => {
  return app.db.get(sql`SELECT * FROM identities WHERE id=${id}`);
};

const getAll = async (ids) => {
  const {rows} = await app.db.query(
    sql`SELECT * FROM identities WHERE id IN(${ids.join(',')})`,
  );
  return rows;
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
  permissioned,
};
