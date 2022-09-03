import sql from 'sql-template-tag';
import {app} from '../../index.js';

// TODO: we can add filters
export const all = async ({offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`SELECT COUNT(*) OVER () as total_count, 
    org.*,
    array_to_json(org.social_causes) AS social_causes,
    row_to_json(m_image.*) AS image,
    row_to_json(m_cover.*) AS cover_image
    FROM organizations org
    LEFT JOIN media m_image ON m_image.id=org.image
    LEFT JOIN media m_cover ON m_cover.id=org.cover_image
    ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const get = async (id) => {
  return app.db.get(sql`
    SELECT org.*,
    array_to_json(org.social_causes) AS social_causes,
    row_to_json(m_image.*) AS image,
    row_to_json(m_cover.*) AS cover_image
    FROM organizations org
    LEFT JOIN media m_image ON m_image.id=org.image
    LEFT JOIN media m_cover ON m_cover.id=org.cover_image
    WHERE org.id=${id}`);
};
