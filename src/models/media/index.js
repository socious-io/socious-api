import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

const insert = async (identityId, filename, url) => {
  try {
    const rows = await app.db.query(sql`
      INSERT INTO media (identity_id, filename, url)
        VALUES (${identityId}, ${filename}, ${url})
        RETURNING *
      `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export default {
  insert,
};
