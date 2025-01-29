import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'locations'
const indices = {
  index,
  settings: {
    analysis: {
      normalizer: {
        case_insensitive_normalizer: {
          type: 'custom',
          filter: ['lowercase']
        }
      }
    }
  },
  fields: {
    //mutual
    id: {
      type: 'integer'
    }, //geonameid
    name: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    }, // name for geoname, country for countryinfo
    iso_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    iso3_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    fips_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    population: {
      type: 'integer'
    },
    created_at: {
      type: 'date'
    },
    updated_at: {
      type: 'date'
    },

    //geoname fields
    asciiname: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    country_name: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    postal_code_format: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    postal_code_regex: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },

    latlong: {
      type: 'geo_point'
    },
    feature_class: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    feature_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    country_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    cc2: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    admin1_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    admin2_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    timezone: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    timezone_utc: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },

    //countries fields
    iso_numeric: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    capital: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    area: {
      type: 'integer'
    },
    continent: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    tld: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    currency_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    currency_name: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    phone: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    languages: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    neighbours: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    equivalent_fips_code: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },

    //type
    location_type: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }
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
    latlong: [document.latlong.y, document.latlong.x],
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
    location_type: 'geoname'
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
    location_type: 'country'
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

const indexing = async ({ id }) => {
  let document
  const indexingDocuments = []

  let country, geoname

  try {
    country = await app.db.get(
      sql`
      SELECT * FROM countries
      WHERE id=${id}
      `
    )
  } catch (e) {
    country = null
  }

  try {
    geoname = await app.db.get(
      sql`
      SELECT * FROM geonames
      WHERE id=${id}
      `
    )
  } catch (e) {
    geoname = null
  }

  if (country) {
    document = countriesTransformer(country)
    indexingDocuments.push(app.searchClient.indexDocument(index, document.id, document))
  } else if (geoname) {
    document = geoNamesTransformer(geoname)
    console.log(document)
    indexingDocuments.push(app.searchClient.indexDocument(index, document.id, document))
  } else {
    indexingDocuments.push(app.searchClient.deleteDocument(index, id))
  }

  try {
    return await Promise.all(indexingDocuments)
  } catch (e) {
    console.log(e)
  }
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
  initIndexing,
  indexing
}
