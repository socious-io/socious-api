import axios from 'axios';
import {getProject, processProject, lastIdealistProject} from './project.js';
import {sleep} from './helpers.js';
import config from '../../config.js';

const since_timstamp = process.env.IDEALIST_SINCE; // add timestamp to .env for testing purposes (ex. '2022-09-14 17:30:07')

const idealist_token = process.env.IDEALIST_TOKEN; // '743e1f3940484d7680130c748ed22758';

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

      let projectType;

      if (types === 'jobs') {
        projectType = 'job'; //we need singular object property later
      } else if (types === 'volops') {
        projectType = 'volop';
      } else if (types === 'internships') {
        projectType = 'internship';
      }

      //process project and insert/update in database

      if (p && p[projectType]) {
        if ((await processProject(p[projectType], projectType)) === true) {
          res++;

          obj.processed = 1; //mark project as processed

          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(`${res} ${types}`);
        }
      }

      //wait some time after each 50th project
      if (count > 50) {
        if (config.idealist.wait_between_project > 0) {
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(
            `Waiting ${config.idealist.wait_break / 1000} secons`,
          );
          await sleep(config.idealist.wait_break);
        }
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
 * @param {string} projectTypes
 * @returns object
 */

export async function getListings(projectTypes) {
  try {
    let ttl = 200;
    const allProjects = [];
    let hasMore = true;

    //get the last project from Idealist of this type from database
    let since = await lastIdealistProject(projectTypes); //get from database

    if (since_timstamp) since = since_timstamp;

    if (!since) since = '';

    while (ttl > 0 && hasMore === true) {
      const response = await axios
        .get(`https://www.idealist.org/api/v1/listings/${projectTypes}`, {
          params: {
            since: since,
          },
          auth: {
            username: idealist_token,
            password: '',
          },
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(
              `Error in response getting listings for ${projectTypes},
            ${error.response.status}`,
            );
            //console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // 'error.request' is an instance of http.ClientRequest in node.js
            throw new Error(
              `Error in request getting listings for ${projectTypes},
            ${error.request}`,
            );
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log(
              `Other error getting listing for ${projectTypes},
            ${error.message}`,
            );
          }
        });

      if (response.status === 200) {
        hasMore = response.data.hasMore;

        let projects = response.data[projectTypes]; //array

        if (projects.length > 0) {
          //get the since from this stack of project listing
          since = projects[projects.length - 1].updated;

          for (let y = 0; y < projects.length; y++) {
            allProjects.push({id: projects[y].id, processed: 0});
          }
        }
      } else if (response.status < 500) {
        //we will stop listings of this type for errors ~400
        hasMore = false;
      }

      ttl--;
    }

    console.log(
      `${allProjects.length} ${projectTypes} will be loaded from Idealist.`,
    );

    return allProjects; //returns all ids from one type
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
    //will continue to next type
  }
}
