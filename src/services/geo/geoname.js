import sql from 'sql-template-tag';
import {app} from '../../index.js';

export async function locationsByCountry(countryCode) {
  const {rows} = await app.db.query(sql`SELECT
    loc.id as id, loc.name as name, loc.feature_code as type, loc.population as pop, loc.country_code as country,
    loc.admin1_code as region_id, adm.name as region_name
    FROM geonames loc
    LEFT JOIN geonames adm ON adm.feature_code = 'ADM1' AND adm.admin1_code = loc.admin1_code AND adm.country_code = loc.country_code
    WHERE loc.country_code = ${countryCode} AND loc.feature_class = 'P'
    ORDER BY loc.name ASC
  `);
  return rows;
}
