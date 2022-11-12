import sql from 'sql-template-tag';
import {app} from '../../index.js';

export async function locationsByCountry(countryCode) {
  const {rows} = await app.db.query(sql`SELECT
    loc.id as id, loc.name as name, loc.feature_code as type, loc.population as pop, loc.country_code as country,
    loc.admin1_code as region
    FROM geonames loc
    WHERE country_code = ${countryCode} AND feature_class = 'P'
    ORDER BY name ASC
  `);
  return rows;
}
