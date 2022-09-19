import config from '../../config.js';
import {configureHttp} from './http-agent/configure-http.js';
import {getIds, getAllProjects} from './controller.js';
import {
  sleep,
  removeProcessedProjectIds,
  checkUnprocessedIds,
} from './helpers.js';

//Start the Idealist functionality...
export async function start() {
  configureHttp();

  //get the listings of projects
  console.log('Getting lists of projects from Idealist...');
  const project_ids = await getIds();

  //get the projects and organizations
  console.log('Getting projects from Idealist...');
  await getAllProjects(project_ids);

  //check if there are not processed projects in the listing
  console.log('Checking if all the projects are successfully loaded...');
  const remain_ids = await removeProcessedProjectIds(project_ids);

  //get all projects again with unsuccessfull ids...
  const unprocessedIds = await checkUnprocessedIds(remain_ids);

  if (unprocessedIds > 0) {
    await sleep(config.idealist.wait_break || 10000);

    console.log('Repeating the process for not processed projects...');

    await getAllProjects(remain_ids);
  }

  console.log('\x1b[32m%s\x1b[0m', 'Projects successfully saved.');

  process.exit(0);
}
