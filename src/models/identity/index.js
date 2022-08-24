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

const getByIds = async (ids) => {
  const {rows} = await app.db.query(
    sql`SELECT * FROM identities WHERE id = ANY(${ids})`,
  );
  return rows;
};

const getAll = async (userId, identityId) => {
  const {rows} = await app.db.query(sql`
    SELECT i.*, false AS primary,
      (CASE
        WHEN i.id=${identityId} THEN true
        ELSE false
      END) AS current
    FROM org_members m
    JOIN identities i ON i.id=m.org_id
    WHERE user_id=${userId}
  `);
  const primary = await get(userId);
  rows.push({
    current: primary.id === identityId,
    primary: true,
    ...primary,
  });
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
  getByIds,
  permissioned,
};
