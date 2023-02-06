// GET LIST OF UNPUBLISHED PROJECTS AND CHECK EXPIRES_AT DATE OF PROJECTS IN DATABASE,
// THEN EXPIRE THOSE PROJECTS IN DATABASE

import axios from 'axios'
import { configureHttp } from './http-agent/configure-http.js'

import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { expireProjects, getProject } from './project.js'

const idealist_token = process.env.IDEALIST_TOKEN // '743e1f3940484d7680130c748ed22758';
const since_timstamp = process.env.IDEALIST_SINCE // '2022-09-22 00:00:00';

const projectTypes = ['jobs', 'internships', 'volops']

/**
 *
 * @example
 */
export async function checkIdealist() {
  configureHttp()

  for (let x = 0; x < projectTypes.length; x++) {
    // get list of all unpublished projects of one type from Idealist
    console.log(`Getting list of projects of type: ${projectTypes[x]}`)

    const ids = await getListings(projectTypes[x])

    // update database with expired projects
    const count = await expireProjects(projectTypes[x], ids)

    console.log(`${count} ${projectTypes[x]} updated to status 'EXPIRE'`)
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
        other_party_title=ANY(${projectTypes})
      LIMIT ${limit} OFFSET ${offset}
    `)
    offset += limit

    if (rows.length < 1) break
    let exists = 0
    let expired = 0
    for (const project of rows) {
      try {
        await getProject(project.other_party_title, project.other_party_id)
        exists++
      } catch {
        await expireProjects(project.other_party_title, [project.other_party_id])
        expired++
        console.log(`${project.id} has been expired`)
      }
    }
    console.log(`${exists} of projects still exists on Idealist and ${expired} of them expired`)
  }
  process.exit(0)
}

/**.
 * Get list of all unpublished projects of type and return array of its ID
 *
 * @param {string} projectTypes
 * @returns array
 * @example
 */
/**
 *
 * @param projectTypes
 * @example
 */
async function getListings(projectTypes) {
  try {
    let ttl = 200
    // const all_projects = [];
    let hasMore = true

    // get the last project from Idealist of this type from database
    let since = await firstIdealistActiveProject(projectTypes) // get from database

    let countUnpublished = 0
    let projectsCount = 0
    const unpublishedProjects = []

    if (since_timstamp) since = since_timstamp

    if (!since) since = ''

    while (ttl > 0 && hasMore === true) {
      const response = await axios
        .get(`https://www.idealist.org/api/v1/listings/${projectTypes}`, {
          params: {
            includeUnpublished: true,
            since
          },
          auth: {
            username: idealist_token,
            password: ''
          }
        })
        .catch(function (error) {
          if (error.response) {
            throw new Error(
              `Error in response getting listings for ${projectTypes},
            ${error.response.status}`
            )
            // console.log(error.response.headers);
          } else if (error.request) {
            throw new Error(
              `Error in request getting listings for ${projectTypes},
            ${error.request}`
            )
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log(
              `Other error getting listing for ${projectTypes},
            ${error.message}`
            )
          }
        })

      if (response.status === 200) {
        hasMore = response.data.hasMore

        const projects = response.data[projectTypes] // array

        if (projects.length > 0) {
          projectsCount = projectsCount + projects.length

          process.stdout.clearLine(0)
          process.stdout.cursorTo(0)
          process.stdout.write(`Loaded: ${projectsCount} ${projectTypes}`)

          // get the since from this stack of project listing
          since = projects[projects.length - 1].updated

          for (let y = 0; y < projects.length; y++) {
            if (projects[y].isPublished === false) {
              countUnpublished++

              unpublishedProjects.push(projects[y].id)
            }
          }
        }
      } else if (response.status < 500) {
        // we will stop listings of this type for errors
        hasMore = false
      }

      ttl--
    }
    process.stdout.write('\n')

    console.log(`Found ${countUnpublished} unpublished ${projectTypes} from Idealist`)

    return unpublishedProjects
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message)
    // will continue to next type
  }
}

/**.
 * Get first active Idealist project of type
 *
 * @param {string} projectTypes
 * @returns string | null
 * @example
 */
/**
 *
 * @param projectTypes
 * @example
 */
async function firstIdealistActiveProject(projectTypes) {
  try {
    const projectType = projectTypes.slice(0, -1)

    const row = await app.db.get(
      sql`SELECT updated_at FROM projects WHERE other_party_title = ${projectType} 
      AND status = 'ACTIVE' ORDER BY updated_at ASC LIMIT 1`
    )

    return new Date(row.updated_at).toISOString()
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message)
    return null
  }
}
