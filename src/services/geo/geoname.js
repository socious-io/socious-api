import sql, { join } from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering, sorting, textSearch } from '../../utils/query.js'

export const filterColumns = {
  region_name: {
    type: String,
    as: 'adm.name'
  },
  region_code: {
    type: String
  },
  region_iso: {
    type: String,
    as: 'adm.iso_code'
  },
  region_fips: {
    type: String,
    as: 'adm.fips_code'
  },
  population: {
    type: Number,
    as: 'loc.population'
  }
}

export const sortColumns = ['name', 'population', 'id']

/**
 *
 * @param filter
 * @example
 */
function filterRegion(filter) {
  if (filter.region_code == null) return filtering(filter, filterColumns, true)
  const region_code = filter.region_code
  delete filter.region_code
  return join(
    [
      filtering(filter, filterColumns, true),
      sql`(adm.iso_code = ${region_code} OR adm.fips_code = ${region_code}
      OR adm2.iso_code = ${region_code} OR adm2.fips_code = ${region_code} OR adm2.admin2_code = ${region_code})`
    ],
    ' AND '
  )
}

/**
 *
 * @param countryCode
 * @param root0
 * @param root0.offset
 * @param root0.limit
 * @param root0.filter
 * @param root0.sort
 * @example
 */
export async function locationsByCountry(countryCode, { offset = 0, limit = 10, filter, sort }) {
  const { rows } = await app.db.query(sql`SELECT COUNT(*) OVER () as total_count,
    loc.id as id, loc.asciiname as name, loc.feature_code as type, loc.population as population, loc.country_code as country_code,
    loc.admin1_code as region_id, loc.admin2_code as subregion_id,
    adm.name as region_name, adm.iso_code as region_iso,
    adm2.name as subregion_name, adm2.iso_code as subregion_iso
    FROM geonames loc
    LEFT JOIN geonames adm ON adm.feature_code = 'ADM1' AND adm.admin1_code = loc.admin1_code AND adm.country_code = loc.country_code
    LEFT JOIN geonames adm2 ON adm2.feature_code = 'ADM2' AND adm2.admin2_code = loc.admin2_code AND adm2.country_code = loc.country_code
    WHERE loc.country_code = ${countryCode} AND loc.feature_class = 'P'
    ${filterRegion(filter)}
    ${sorting(sort || 'name', sortColumns, 'loc')}
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

/**
 *
 * @param countryCode
 * @param search
 * @param root0
 * @param root0.offset
 * @param root0.limit
 * @param root0.filter
 * @param root0.sort
 * @example
 */
export async function locationsSearchByCountry(countryCode, search, { offset = 0, limit = 10, filter }) {
  const searchPat = `%${search}%`
  const { rows } = await app.db.query(sql`SELECT COUNT(*) OVER () as total_count,
    loc.id as id, loc.asciiname as name, loc.feature_code as type, loc.population as population, loc.country_code as country_code,
    loc.admin1_code as region_id, loc.admin2_code as subregion_id,
    adm.name as region_name, adm.iso_code as region_iso,
    adm2.name as subregion_name, adm2.iso_code as subregion_iso
    FROM geonames loc
    LEFT JOIN geonames adm ON adm.feature_code = 'ADM1' AND adm.admin1_code = loc.admin1_code AND adm.country_code = loc.country_code
    LEFT JOIN geonames adm2 ON adm2.feature_code = 'ADM2' AND adm2.admin2_code = loc.admin2_code AND adm2.country_code = loc.country_code
    WHERE loc.country_code = ${countryCode} AND loc.feature_class = 'P'
    AND loc.asciiname ILIKE ${searchPat}
    ${filterRegion(filter)}
    ORDER BY 
    CASE 
        WHEN LEFT(LOWER(loc.asciiname), ${search.length}) = ${search} THEN 0
        ELSE 1
    END,
    LOWER(loc.asciiname) ASC
    LIMIT ${limit} OFFSET ${offset}
  `)
  if (rows.length && rows[0].total_count >= limit) return rows

  const { rows: rowsAlt } = await app.db.query(sql`SELECT
    COUNT(*) OVER () as total_count,
    loc.id as id, loc.asciiname as name, loc.feature_code as type, loc.population as population, loc.country_code as country_code,
    alt.alternate_name, alt.iso_language as alt_language,
    alt.is_historic, alt.is_colloquial, alt.is_short_name,
    loc.admin1_code as region_id, loc.admin2_code as subregion_id,
    adm.name as region_name, adm.iso_code as region_iso,
    adm2.name as subregion_name, adm2.iso_code as subregion_iso
    FROM geonames loc
    LEFT JOIN geonames adm ON adm.feature_code = 'ADM1' AND adm.admin1_code = loc.admin1_code AND adm.country_code = loc.country_code
    LEFT JOIN geonames adm2 ON adm2.feature_code = 'ADM2' AND adm2.admin2_code = loc.admin2_code AND adm2.country_code = loc.country_code
    LEFT JOIN geonames_alt alt ON alt.geoname_id = loc.id
    WHERE loc.country_code = ${countryCode} AND loc.feature_class = 'P'
    AND (alt.alternate_name ILIKE ${searchPat} AND NOT loc.asciiname ILIKE ${searchPat})
    ${filterRegion(filter)}
    ORDER BY 
    CASE 
        WHEN LEFT(LOWER(loc.asciiname), ${search.length}) = ${search} THEN 0
        ELSE 1
    END,
    LOWER(loc.asciiname) ASC
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows.concat(rowsAlt)
}

export const getAll = async (ids, sort) => {
  const { rows } = await app.db.query(sql`SELECT
    COUNT(*) OVER () as total_count, alt.id as add_id,
    loc.id as id, loc.asciiname as name, loc.feature_code as type, loc.population as population, loc.country_code as country_code,
    alt.alternate_name, alt.iso_language as alt_language,
    alt.is_historic, alt.is_colloquial, alt.is_short_name,
    loc.admin1_code as region_id, loc.admin2_code as subregion_id,
    adm.name as region_name, adm.iso_code as region_iso,
    adm2.name as subregion_name, adm2.iso_code as subregion_iso,
    loc.timezone,
    loc.country_name,
    loc.timezone_utc
    FROM geonames loc
    LEFT JOIN geonames adm ON adm.feature_code = 'ADM1' AND adm.admin1_code = loc.admin1_code AND adm.country_code = loc.country_code AND adm.id <> loc.id
    LEFT JOIN geonames adm2 ON adm2.feature_code = 'ADM2' AND adm2.admin2_code = loc.admin2_code AND adm2.country_code = loc.country_code AND adm2.id <> loc.id
    LEFT JOIN geonames_alt alt ON alt.geoname_id = loc.id and alt.iso_language = 'en' and is_preferred_name=true
    WHERE loc.id=ANY(${ids}) AND loc.feature_class = 'P'
    ${sorting(sort, sortColumns, 'loc')}
  `)
  return rows
}

export async function locationsSearch(q, { offset = 0, limit = 10, filter, sort }) {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(*) OVER () as total_count,
      loc.id
    FROM geonames loc
    WHERE
      loc.search_tsv @@ to_tsquery(${textSearch(q)})
      AND loc.feature_class = 'P'
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
  `)

  const locs = await getAll([...new Set(rows.map((r) => r.id))], sort)

  return locs.map((r) => {
    return {
      total_count: rows.length > 0 ? rows[0].total_count : 0,
      ...r
    }
  })
}
