import sql, {raw, join} from 'sql-template-tag';
import {app} from '../../index.js';
import {filtering, sorting} from '../../utils/query.js';

export const filterColumns = {
  region_name: {
    type: String,
    as: 'adm.name',
  },
  population: {
    type: Number,
    as: 'loc.population',
  },
};

export const sortColumns = ['name', 'population', 'id'];

export async function locationsByCountry(
  countryCode,
  {offset = 0, limit = 10, filter, sort},
) {
  const {rows} = await app.db.query(sql`SELECT COUNT(*) OVER () as total_count,
    loc.id as id, loc.name as name, loc.feature_code as type, loc.population as population, loc.country_code as country_code,
    loc.admin1_code as region_id, adm.name as region_name
    FROM geonames loc
    LEFT JOIN geonames adm ON adm.feature_code = 'ADM1' AND adm.admin1_code = loc.admin1_code AND adm.country_code = loc.country_code
    WHERE loc.country_code = ${countryCode} AND loc.feature_class = 'P'
    ${filtering(filter, filterColumns, true)}
    ${sorting(sort || 'name', sortColumns, 'loc')}
    LIMIT ${limit} OFFSET ${offset}
  `);
  return rows;
}
