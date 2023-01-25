/* eslint-disable no-unused-vars */
import pg from 'pg'
import readlines from 'n-readlines'
import sql from 'sql-template-tag'
import iso3166 from 'iso3166-2-db/i18n/dispute/UN/geonames.json' assert { type: 'json' }

import Config from '../src/config.js'

/* http://download.geonames.org/export/dump/ for schema and files
download allcountries.zip and alternateNamesV2.zip, unpack inside `import`

To import cities/adm1s without alternate names, create a blank file with the
name `alternateNamesV2.txt`; to import only alternates without cities, create
a blank `allCountries.txt`
 */

const FEATURE_CODE_BLACKLIST = 'PPLH,PPLW,PPLQ,PPLX'.split(',')
const FEATURE_CODE_WHITELIST = 'ADM1,ADM2,STLMT,TRB'.split(',')
const IMPORT_ADMIN2_FOR = 'GB,GR'.split(',')
const POPULATION_MIN = 100

const client = new pg.Client(Config.database)
const allCountries = new readlines('import/allCountries.txt')
const altNames = new readlines('import/alternateNamesV2.txt')

try {
  await client.connect()

  console.log('names')
  let line
  let i = 0

  while (i > 0 && (line = allCountries.next())) {
    if (++i % 10000 === 0) {
      console.log(`\n${i / 1000}k`)
    }

    line = line.toString('utf-8').trim()
    if (!line.length) continue
    const [
      geonameid,
      name,
      asciiname,
      alternatenames,
      latitude,
      longitude,
      feature_class,
      feature_code,
      country_code,
      cc2,
      admin1_code,
      admin2_code,
      admin3_code,
      admin4_code,
      population_,
      elevation,
      dem,
      timezone,
      modification_date
    ] = line.split('\t')
    const population = isNaN(population_) ? 0 : Number(population_)
    if (
      FEATURE_CODE_BLACKLIST.includes(feature_code) ||
      population < POPULATION_MIN
    ) {
      process.stdout.write('.')
      continue
    }

    if (
      FEATURE_CODE_WHITELIST.includes(feature_code) ||
      feature_code.startsWith('PPL')
    ) {
      if (
        feature_code === 'ADM2' &&
        !IMPORT_ADMIN2_FOR.includes(country_code)
      ) {
        process.stdout.write('.')
        continue
      }
      process.stdout.write('o')
      await client.query(sql`
        INSERT INTO geonames (
          id,
          name,
          asciiname,
          latlong,
          feature_class,
          feature_code,
          country_code,
          cc2,
          admin1_code,
          admin2_code,
          timezone,
          population,
          updated_at
        ) VALUES (
          ${Number(geonameid)},
          ${name},
          ${asciiname},
          POINT(${Number(latitude)}, ${Number(longitude)}),
          ${feature_class},
          ${feature_code},
          ${country_code},
          ${cc2.split(',')},
          ${admin1_code},
          ${admin2_code.length <= 20 ? admin2_code : ''},
          ${timezone},
          ${population},
          ${modification_date}
        ) ON CONFLICT (id) DO UPDATE SET
          name = ${name},
          asciiname = ${asciiname},
          latlong = POINT(${Number(latitude)}, ${Number(longitude)}),
          feature_class = ${feature_class},
          feature_code = ${feature_code},
          country_code = ${country_code},
          cc2 = ${cc2.split(',')},
          admin1_code = ${admin1_code},
          admin2_code = ${admin2_code.length <= 20 ? admin2_code : ''},
          timezone = ${timezone},
          population = ${population},
          updated_at = ${modification_date}
      `)
    } else {
      process.stdout.write('.')
    }
  }

  i = 0
  console.log('\nregion codes')
  for (const country of Object.values(iso3166)) {
    for (const region of country.regions || []) {
      if (++i % 1000 === 0) {
        console.log(`\n${i / 1000}k`)
      }
      if (!(region.reference?.geonames && (region.iso || region.fips))) {
        process.stdout.write('.')
      }
      const { rows } = await client.query(sql`UPDATE geonames
        SET
          iso_code = ${region.iso},
          fips_code = ${region.fips}
        WHERE id = ${region.reference.geonames}
        RETURNING id
      `)
      if (rows.length === 0) {
        process.stdout.write('_')
      } else process.stdout.write('o')
    }
  }

  i = 0
  console.log('\nalternates')
  while ((line = altNames.next())) {
    if (++i % 10000 === 0) {
      console.log(`\n${i / 1000}k`)
    }

    line = line.toString('utf-8').trim()
    if (!line.length) continue
    const [
      id,
      geoname_id,
      iso_language,
      alternate_name,
      is_preferred_name,
      is_short_name,
      is_colloquial,
      is_historic,
      from,
      to
    ] = line.split('\t')
    // if (iso_language.length <= 3) {
    if (['', 'en'].includes(iso_language)) {
      const { rows } = await client.query(
        sql`SELECT id FROM geonames WHERE id = ${geoname_id} LIMIT 1`
      )
      if (rows.length === 0) {
        process.stdout.write('_')
        continue
      }
      process.stdout.write('o')
      await client.query(sql`
      INSERT INTO geonames_alt (
        id,
        geoname_id,
        iso_language,
        alternate_name,
        is_preferred_name,
        is_short_name,
        is_colloquial,
        is_historic
      ) VALUES (
        ${Number(id)},
        ${Number(geoname_id)},
        ${iso_language},
        ${alternate_name},
        ${is_preferred_name === '1'},
        ${is_short_name === '1'},
        ${is_colloquial === '1'},
        ${is_historic === '1'}
      ) ON CONFLICT (id) DO UPDATE SET
        geoname_id = ${Number(geoname_id)},
        iso_language = ${iso_language},
        alternate_name = ${alternate_name},
        is_preferred_name = ${is_preferred_name === '1'},
        is_short_name = ${is_short_name === '1'},
        is_colloquial = ${is_colloquial === '1'},
        is_historic = ${is_historic === '1'}
    `)
    } else {
      process.stdout.write('.')
    }
  }
} catch (e) {
  console.log(e)
  process.exit(1)
}
process.exit(0)
