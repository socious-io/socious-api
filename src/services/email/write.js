import sql from 'sql-template-tag';
import {app} from '../../index.js';

export const insert = async (id, options, info) => {
  await app.db.query(
    sql`INSERT INTO emails (message_id, options, info) VALUES (${id}, ${options}, ${info})`,
  );
};
