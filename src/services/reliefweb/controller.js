import axios from 'axios'
import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { configureHttp } from '../idealist/http-agent/configure-http.js'

import { getLastReliefWebProjectId, processProject } from './project.js'

const url = 'https://api.reliefweb.int/v2/jobs'
const appName = process.env.RELIEFWEB_APPNAME || 'sociousjobaggregatorx7k2tqfw4zOnWYO3va14'

/**
 *
 * @example
 */
export async function listProjects() {
  configureHttp()

  let last_id = await getLastReliefWebProjectId()
  let next = true
  let ttl = 100
  const limit = 100 // up to 1000, defaults to 1000

  let count = 0
  let countProcessing = 0
  try {
    while (ttl > 0 && next === true) {
      const response = await axios
        .post(`${url}?appname=${appName}`, {
          filter: { field: 'id', value: { from: last_id } },
          sort: ['id:asc'],
          limit,
          profile: 'full'
        }, {
          headers: {
            Accept: 'application/json'
          }
        })
        .catch(function (error) {
          if (error.response) {
            // console.log(error.response);
            throw new Error(`Error in response getting listings, ${error.response.status}`)
            // console.log(error.response.headers);
          } else if (error.request) {
            // console.log(error.request);
            throw new Error(`Error in request getting listings for, ${error.message}`)
          } else {
            console.log(`Other error getting listing for, ${error.message}`)
          }
        })

      if (response.status === 200) {
        countProcessing = countProcessing + response.data.data.length
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0)
        process.stdout.write('Projects found: ' + countProcessing)

        const data = response.data.data

        if (!response.data.links?.next) {
          next = false
        }

        if (data.length > 0) {
          last_id = data[data.length - 1].id
        }

        for (let x = 0; x < data.length; x++) {
          if (await processProject(data[x].fields)) {
            count++
          }
        }
      } else if (response.status < 500) {
        next = false
        console.log(`Error while getting reliefweb projects: ${response.status}`)
      } else {
        console.log(`Error getting reliefweb projects: ${response.status}`)
        console.log(response)
      }

      ttl--
    }
    process.stdout.write('\n')
    console.log('\x1b[33m%s\x1b[0m', `${count} projects processed.`)
  } catch (err) {
    console.log(err)
  }
  process.exit(0)
}

/**
 *
 * @example
 */
export async function verifyExists() {
  const limit = 50
  let offset = 0
  console.log('checking all current DB idealist projects')
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { rows } = await app.db.query(sql`
      SELECT id, other_party_title, other_party_id 
      FROM projects 
      WHERE 
        other_party_id IS NOT NULL AND 
        status='ACTIVE' AND
        other_party_title='reliefweb job'
      LIMIT ${limit} OFFSET ${offset}
    `)
    offset += limit

    if (rows.length < 1) break
    let exists = 0
    let expired = 0
    for (const project of rows) {
      const response = await axios.get(`https://api.reliefweb.int/v2/jobs/${project.other_party_id}?appname=${appName}`, {
        headers: {
          Accept: 'application/json'
        }
      })
      if (response.status === 200) {
        exists++
      } else {
        await expireProjects(project.id)
        expired++
        console.log(`${project.id} has been expired`)
      }
    }
    console.log(`${exists} of projects still exists on Idealist and ${expired} of them expired`)
  }
  process.exit(0)
}

/**
 *
 * @example
 */
export async function validateCurrentProjects() {}

/**
 *
 * @param id
 * @example
 */
export async function expireProjects(id) {
  let count = 0

  try {
    const res = await app.db.query(sql`
    UPDATE projects 
    SET status = 'EXPIRE',
      expires_at = NOW()
    WHERE id=${id}
    `)

    if (res.rowCount > 0) {
      count = res.rowCount
      // console.log(`${count} projects updated to EXPIRE.`);
    }
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message)
  }

  return count
}
