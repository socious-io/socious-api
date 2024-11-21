import { app } from '../../../index.js'
import sql from 'sql-template-tag'
import { normalizeIndexName } from '../utils.js'

const index = normalizeIndexName('locations')
const indices = {
  index,
  fields: {
    //mutual
    id: { type: 'integer' }, //geonameid
    name: { type: 'text' }, // name for place, country for countryinfo
    iso_code: { type: 'keyword' },
    iso3_code: { type: 'keyword' },
    fips_code: { type: 'keyword' },
    population: { type: 'integer' },
    created_at: { type: 'date' },
    updated_at: { type: 'date' },

    //geoname fields
    asciiname: { type: 'text' },
    country_name: { type: 'text' },
    postal_code_format: { type: 'text' },
    postal_code_regex: { type: 'text' },

    latlong: { type: 'geo_point' },
    feature_class: { type: 'keyword' },
    feature_code: { type: 'keyword' },
    country_code: { type: 'keyword' },
    cc2: { type: 'keyword' },
    admin1_code: { type: 'keyword' },
    admin2_code: { type: 'keyword' },
    timezone: { type: 'keyword' },
    timezone_utc: { type: 'keyword' },

    //countries fields
    iso_numeric: { type: 'keyword' },
    capital: { type: 'keyword' },
    area: { type: 'integer' },
    continent: { type: 'keyword' },
    tld: { type: 'keyword' },
    currency_code: { type: 'keyword' },
    currency_name: { type: 'keyword' },
    phone: { type: 'keyword' },
    languages: { type: 'keyword' },
    neighbours: { type: 'keyword' },
    equivalent_fips_code: { type: 'keyword' },

    //type
    location_type: { type: 'keyword' }
  }
}

function geoNamesTransformer(document) {

  return {
    id: document.id,
    name: document.name,
    iso_code: document.iso_code,
    fips_code: document.fips_code,
    population: document.population,
    asciiname: document.asciiname,
    country_name: document.country_name,
    latlong: document.latlong,
    feature_class: document.feature_class,
    feature_code: document.feature_code,
    country_code: document.country_code,
    cc2: document.cc2,
    admin1_code: document.admin1_code,
    admin2_code: document.admin2_code,
    timezone: document.timezone,
    timezone_utc: document.timezone_utc,
    created_at: document.created_at,
    updated_at: document.updated_at,
    location_type: "place"
  }
  
}

function countriesTransformer(document) {

  return {
    id: document.id,
    name: document.name,
    iso_code: document.iso_code,
    fips_code: document.fips_code,
    population: document.population,
    iso_code3: document.iso_code3,
    iso_numeric_code: document.iso_numeric_code,
    capital: document.capital,
    area_km: document.area_km,
    continent: document.continent,
    currency_code: document.currency_code,
    currency_name: document.currency_name,
    phone: document.phone,
    postal_code_format: document.postal_code_format,
    postal_code_regex: document.postal_code_regex,
    languages: document.languages,
    neighbours: document.neighbours,
    equivalent_fips_code: document.equivalent_fips_code,
    created_at: document.created_at,
    updated_at: document.updated_at,
    location_type: "country"
  }
}

async function getAllCountries({ offset = 0, limit = 100 }) {
  const { rows } = await app.db.query(
    sql`
    SELECT * FROM countries
    LIMIT ${limit} OFFSET ${offset}
    `
  )

  return rows
}

async function getAllGeoNames({ offset = 0, limit = 100 }) {
  const { rows } = await app.db.query(
    sql`
    SELECT * FROM geonames
    LIMIT ${limit} OFFSET ${offset}
    `
  )

  return rows
}

const initIndexing = async () => {
  let offset = 0,
    limit = 10000,
    count = 0,
    geonames = [],
    countries = []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    geonames = (await getAllGeoNames({ limit, offset })).map(geoNamesTransformer)
    countries = (await getAllCountries({ limit, offset })).map(countriesTransformer)

    if (geonames.length < 1 && countries.length < 1) break
    await app.searchClient.bulkIndexDocuments(index, geonames)
    await app.searchClient.bulkIndexDocuments(index, countries)
    count += geonames.length + countries.length
    offset += limit
  }

  return { count }
}

export default {
  indices,
  initIndexing
}
