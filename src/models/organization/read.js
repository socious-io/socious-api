import sql from 'sql-template-tag';
import {app} from '../../index.js';

// TODO: we can add filters
export const all = async ({offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, * FROM organizations ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const get = async (id) => {
  return app.db.get(sql`SELECT * FROM organizations WHERE id=${id}`);
};
