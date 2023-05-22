import config from '../../config.js'
import { configureHttp } from './http-agent/configure-http.js'
import { getIds, getAllProjects } from './controller.js'
import { sleep, removeProcessedProjectIds, checkUnprocessedIds } from './helpers.js'

// Start the Idealist functionality...
/**
 *
 * @example
 */
export async function start() {
  configureHttp()

  // get the listings of projects
  console.log('Getting lists of projects from Idealist...')
  const projectIds = await getIds()

  // get the projects and organizations
  console.log('Getting projects from Idealist...')
  await getAllProjects(projectIds)

  // check if there are not processed projects in the listing
  console.log('Checking if all the projects are successfully loaded...')
  const remainIds = await removeProcessedProjectIds(projectIds)

  // get all projects again with unsuccessfull ids...
  const unprocessedIds = await checkUnprocessedIds(remainIds)

  if (unprocessedIds > 0) {
    await sleep(config.idealist.wait_break || 10000)

    console.log('Repeating the process for not processed projects...')

    await getAllProjects(remainIds)
  }

  console.log('\x1b[32m%s\x1b[0m', 'Projects successfully saved.')

  process.exit(0)
}
