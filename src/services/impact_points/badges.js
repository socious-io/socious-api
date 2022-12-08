import sql from 'sql-template-tag';
import {app} from '../../index.js';

export const badges = async (identityId) => {
  const {rows} = await app.db.query(sql`
    SELECT SUM(total_points) AS total_points, COUNT(*)::int , social_cause_category 
    FROM impact_points_history
    WHERE identity_id=${identityId}
    GROUP BY social_cause_category
  `);
  return rows;
};

export const history = async (identityId, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
  SELECT COUNT(*) OVER () as total_count, i.* 
  FROM impact_points_history i
  WHERE identity_id=${identityId}
  LIMIT ${limit} OFFSET ${offset}
  ORDER BY created_at DESC
    `);
  return rows;
};
