import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

export const insert = async (party, body) => {
  try {
    const {rows} = await app.db.query(sql`
      INSERT into webhooks (party, content) VALUES (${party}, ${body})
      RETURNING id
    `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export default {
  insert,
};
