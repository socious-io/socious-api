import sql from 'sql-template-tag';
import {app} from '../../index.js';

const all = async ({offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, *
      FROM skills ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

const getAllByNames = async (names) => {
  const {rows} = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, *
    FROM skills 
    WHERE name=ANY(${names})
    ORDER BY created_at DESC`);
  return rows;
};

export default {
  all,
  getAllByNames,
};
