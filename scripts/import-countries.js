// @ts-nocheck
/* eslint-disable no-unused-vars */
import pg from 'pg'
import { open } from 'node:fs/promises'
import sql from 'sql-template-tag'

import Config from '../src/config.js'

const dbConfig = Config.database
// dbConfig.port = parseInt(dbConfig.port)

const client = new pg.Client(dbConfig)

;(async () => {
  const file = await open('import/countryInfo.txt')
  for await (const line of file.readLines()) {
    const [
      iso,
      iso3,
      iso_numeric,
      fips,
      country,
      capital,
      area,
      population,
      continent,
      tld,
      currency_code,
      currency_name,
      phone,
      postal_code_format,
      postal_code_regex,
      languages,
      geonameid,
      neighbours,
      equivalent_fips_code
    ] = line.split('\t')

    await client.query(sql`
      INSERT INTO countries (
        id,
        code,
        code_iso3,
        code_isonumeric,
        fips,
        country,
        capital,
        area_km,
        population,
        continent,
        tld,
        currency_code,
        currency_name,
        phone,
        postal_code_format,
        postal_code_regex,
        languages,
        neighbours,
        equivalent_fips_code
      ) VALUES (
        ${Number(geonameid)},
        ${iso},
        ${iso3},
        ${iso_numeric},
        ${fips},
        ${country},
        ${capital},
        ${area},
        ${population},
        ${continent},
        ${tld},
        ${currency_code},
        ${currency_name},
        ${phone},
        ${postal_code_format},
        ${postal_code_regex},
        ${languages.length>0?languages.split(','):[]},
        ${neighbours.length>0?neighbours.split(','):[]},
        ${equivalent_fips_code}
      )
    `)
  }
})()
