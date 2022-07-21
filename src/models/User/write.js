import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
export const insert = async (username, email, hashedPasswd) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${hashedPasswd}) RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};
