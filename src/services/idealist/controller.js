import axios from 'axios';

import {getProject, processProject, lastIdealistProject} from './project.js';

import {
  sleep,
  //removeProcessedProjectIds,
  //checkUnprocessedIds,
} from './helpers.js';
import config from '../../config.js';

// change null bellow with timestamp for testing purposes
const sinceTimstamp = process.env.IDEALIST_SINCE; // '2022-09-14 17:30:07';

const idealistToken = process.env.IDEALIST_TOKEN; // '743e1f3940484d7680130c748ed22758';

/**
 * Get a list (object) of all the ID of all the projects
 *
 * @returns object
 */
export async function getIds() {
  const types = ['jobs', 'internships', 'volops'];
  let res = {jobs: [], volops: [], internships: []};
  for (let x = 0; x < types.length; x++) {
    res[types[x]] = (await getListings(types[x])) || [];
  }
  return res;
}

/**
 * Process each project fro the given list
 *
 * @param object ids
 * @returns void
 */
export async function getAllProjects(ids) {
  for (let [types, val] of Object.entries(ids)) {
    //for each type of project (job, volop and intenrship)
    let res = 0;
    let count = 0;

    console.log(`Loading ${types} projects...`);

    for (let x = 0; x < val.length; x++) {
      let obj = val[x]; //object {id , processed}
      count++;

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
        }
      }

      //wait some time after each 50th project
      if (count > 50) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(
          `Waiting ${config.idealist.wait_break / 1000} secons`,
        );
        await sleep(config.idealist.wait_break);
        count = 0;
      } else {
        await sleep(config.idealist.wait_between_project);
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

export async function getListings(project_types) {
  try {
    let ttl = 200;
    const all_projects = [];
    let hasMore = true;

    //get the last project from Idealist of this type from database
    let since = await lastIdealistProject(project_types); //get from database

    if (sinceTimstamp) since = sinceTimstamp;

    if (!since) since = '';

    while (ttl > 0 && hasMore === true) {
      const response = await axios
        .get(`https://www.idealist.org/api/v1/listings/${project_types}`, {
          params: {
            since: since,
          },
          auth: {
            username: idealistToken,
            password: '',
          },
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(
              `Error in response getting listings for ${project_types},
            ${error.response.status}`,
            );
            //console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // 'error.request' is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            throw new Error(
              `Error in request getting listings for ${project_types},
            ${error.request}`,
            );
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log(
              `Other error getting listing for ${project_types},
            error.message`,
            );
          }
        });

      if (response.status === 200) {
        hasMore = response.data.hasMore;

        let projects = response.data[project_types]; //array

        if (projects.length > 0) {
          //get the since from this stack of project listing
          since = projects[projects.length - 1].updated;

          for (let y = 0; y < projects.length; y++) {
            all_projects.push({id: projects[y].id, processed: 0});
          }
        }
      } else if (response.status < 500) {
        //we will stop listings of this type for errors ~400
        hasMore = false;
      }

      ttl--;
    }

    console.log(
      `${all_projects.length} ${project_types} will be loaded from Idealist.`,
    );

    return all_projects; //returns all ids from one type
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
    //will continue to next type
  }
}
