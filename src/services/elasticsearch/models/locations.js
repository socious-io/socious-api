import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'locations'
const indices = {
  index,
  fields: {

    //geoname fields
    name: { type: 'text' },
    asciiname: { type: 'text' },
    country_name: { type: 'text' },
    
    id: { type: 'keyword' }, //geoname id
    latlong: { type: 'keyword' }, //TODO: need to convert to geo
    feature_class: { type: 'keyword' },
    feature_code: { type: 'keyword' },
    country_code: { type: 'keyword' },
    cc2: { type: 'keyword' },
    admin1_code: { type: 'keyword' },
    admin2_code: { type: 'keyword' },
    iso_code: { type: 'keyword' },
    fips_code: { type: 'keyword' },
    timezone: { type: 'keyword' },
    population: { type: 'keyword' },//TODO: int
    timezone_utc: { type: 'keyword' },

    //countries fields
    //TODO: add fields
  }
}

function countriesTransformer(document) {
  return {
    
  }
}

function geoNamesTransformer(document) {
  return {
    
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
    limit = 100,
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
