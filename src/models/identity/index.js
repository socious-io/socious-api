import sql from 'sql-template-tag';
import {app} from '../../index.js';

const Types = {
  ORG: 'organizations',
  USER: 'users',
};

const get = async (id) => {
  return app.db.get(sql`SELECT * FROM identities WHERE id=${id}`);
};

const getByRef = async (refId) => {
  return app.db.get(sql`SELECT * FROM identities WHERE ref=${refId}`);
};

export default {
  Types,
  get,
  getByRef,
};
