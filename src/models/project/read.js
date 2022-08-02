import sql from 'sql-template-tag';
import {app} from '../../index.js';

export const get = async (id) => {
  return app.db.get(
    sql`SELECT * FROM projects WHERE id=${id}`,
  );
};

// export const getByPageId = async (page_id) => {
//   return app.db.get(
//     sql`SELECT * FROM projects WHERE page_id=${page_id}`,
//   );
// };

export const all = async ({offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, 
      projects.* FROM projects ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};


