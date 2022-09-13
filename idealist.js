import axios from 'axios';

import {
  getProject,
  processProject,
  lastIdealistProject,
} from './src/services/idealist/project.js';

import {
  sleep,
  removeProcessedProjectIds,
  checkUnprocessedIds,
} from './src/services/idealist/helpers.js';

const sinceTimstamp = '2022-09-13 01:22:07'; // erase this later
const idealistToken = '743e1f3940484d7680130c748ed22758';

//Call the Idealist functionality...
(async () => {
  //get the listings of projects
  console.log('Getting lists of projects from Idealist...');
  const project_ids = await getIds();

  //console.log(project_ids);

  //get the projects and organizations
  console.log('Getting projects from Idealist...');
  await getAllProjects(project_ids);

  //console.log(project_ids);

  //check if there are not processed projects in the listing
  console.log('Checking if all the projects are successfully loaded...');
  const remain_ids = await removeProcessedProjectIds(project_ids);

  console.log(remain_ids);

  //get all projects again with unsuccessfull ids...
  const unprocessedIds = await checkUnprocessedIds(remain_ids);
  if (unprocessedIds > 0) {
    console.log('Repeating the process for not processed projects...');

    await sleep(10000);

    await getAllProjects(remain_ids);
  } else {
    console.log('\x1b[32m%s\x1b[0m', 'All projects successfully saved.');
  }

  process.exit(0);
})();

async function getIds() {
  const types = ['jobs', 'internships', 'volops'];
  let res = {jobs: [], volops: [], internships: []};
  for (let x = 0; x < types.length; x++) {
    res[types[x]] = (await getListings(types[x])) || [];
  }
  return res;
}

async function getAllProjects(ids) {
  for (let [types, val] of Object.entries(ids)) {
    //for each type of project (job, volop and intenrship)
    let res = 0;
    let count = 0;

    // console.log(val);

    // if (!val || val === undefined) continue;

    console.log(`Loading ${types} projects...`);

    process.stdout.write(`Processed ${types} projects: \n`);

    for (let x = 0; x < val.length; x++) {
      let obj = val[x]; //object {id , processed}
      count++;
      //console.log(x + ': ' + types, obj);

      //get project from Idealist
      let p = await getProject(types, obj.id); //use queue?...

      let project_type;

      if (types === 'jobs') {
        project_type = 'job'; //we need singular object property later
      } else if (types === 'volops') {
        project_type = 'volop';
      } else if (types === 'internships') {
        project_type = 'internship';
      }

      //process project and insert/update in database

      if (p && p[project_type]) {
        if ((await processProject(p[project_type], project_type)) === true) {
          res++;

          obj.processed = 1; //mark project as processed

          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(`${res} ${types}`);
          //process.stdout.write('\n'); // end the line
        }
      }

      //wait some time after each 50th project
      if (count > 50) {
        console.log('Waiting 10 seconds...');
        await sleep(10000);
        count = 0;
      }
    }

    process.stdout.write('\n');

    console.log(
      '\x1b[33m%s\x1b[0m',
      `${res} ${types} projects processed from Idealist.`,
    );
  }
}

/**
 * Get the all listings of projects from Idealist from one type
 * and put their ID into object
 *
 * @param {string} project_types
 * @returns object
 */

async function getListings(project_types) {
  try {
    let ttl = 200;
    const all_projects = [];
    let hasMore = true;

    //get the last project from Idealist of this type from database
    //let since = await lastIdealistProject(project_types); //get from database

    let since = sinceTimstamp;

    //console.log(project_types, since);
    if (!since) since = '';

    while (ttl > 0 && hasMore === true) {
      const response = await axios.get(
        `https://www.idealist.org/api/v1/listings/${project_types}`,
        {
          params: {
            since: since,
          },
          auth: {
            username: idealistToken,
            password: '',
          },
        },
      );

      if (response.status === 200) {
        hasMore = response.data.hasMore;

        let projects = response.data[project_types]; //array

        //console.log(project_types, projects.length);

        if (projects.length > 0) {
          //get the since from this stack of project listing
          since = projects[projects.length - 1].updated;

          for (let y = 0; y < projects.length; y++) {
            all_projects.push({id: projects[y].id, processed: 0});
          }
        }
      }
      //NOTICE: in case of bad response (400, 401, 404...),
      //the loop will try to load the same listing (from the same date)
      //till successfull or till ttl expires
      ttl--;
    }

    console.log(
      `${all_projects.length} ${project_types} will be loaded from Idealist.`,
    );

    return all_projects; //returns all ids from one type
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
  }
}

//console.log('________________THIS IS END OF LINE_________');
