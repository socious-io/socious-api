// @ts-nocheck
/* eslint-disable no-unused-vars */
import pg from 'pg'
import { open } from 'node:fs/promises'
import sql from 'sql-template-tag'

import Config from '../src/config.js'
;(async () => {
  //Connecting DB
  const client = new pg.Client(Config.database)
  await client.connect()

  //Reading File
  const file = await open('import/countryInfo.txt')

  //Importing
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

    try {
      await client.query(sql`
        INSERT INTO countries (
          id,
          iso_code,
          iso_code3,
          iso_numeric_code,
          fips_code,
          name,
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
          ${languages.length > 0 ? languages.split(',') : []},
          ${neighbours.length > 0 ? neighbours.split(',') : []},
          ${equivalent_fips_code}
        )
      `)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }
  await client.end()
  console.log('Imported Countries')
  process.exit(0)
})()
