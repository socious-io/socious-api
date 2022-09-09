import axios from 'axios';
import https from 'https';
import http from 'http';

//axios.defaults.timeout = 60000;
//axios.defaults.httpsAgent = new https.Agent({keepAlive: true});

const sinceTimstamp = '2022-09-07 22:02:07';
const ttlStart = 10;
const idealistToken = '743e1f3940484d7680130c748ed22758';

//import sql from 'sql-template-tag';
//import {app} from './src/index.js';

const all_projects = {jobs: [], volops: [], internships: []};
//const all = {jobs: [], volops: [], internships: []};

const getAllIds = async () => {
  return new Promise((resolve, reject) => {
    try {
      ['jobs', 'internships', 'volops'].forEach((el) => {
        console.log(el);

        const ids = getListings(el);
        resolve(ids);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
};

const getAllProjects = async (ids) => {
  //const all = {jobs: [], volops: [], internships: []};

  for (let [key, val] of Object.entries(ids)) {
    //for each type of project (job, volop and intenrship)
    //console.log(key, val);
    let res = 0;
    let count = 0;

    for (let x = 0; x < val.length; x++) {
      let id = val[x];
      count++;
      console.log(x + ': ' + key, id);

      let p = await project(key, id); //here to use the queue?

      let project_type;
      //use the p to parse and save to database
      if (key === 'jobs') {
        project_type = 'job'; //we need singular object property later
      } else if (key === 'volops') {
        project_type = 'volop';
      } else if (key === 'intenrships') {
        project_type = 'internship';
      }

      if (p && p[project_type]) {
        // its like obj.job or obj.volop
        // if ((await processProject(p[project_type])) === true) {
        //   res++;
        // }

        res++;
        console.log(p[project_type].name, res);
      }

      if (count > 50) {
        console.log('Waiting 10 seconds...');
        await sleep(10000);
        count = 0;
      }
    }

    // val.forEach(async (id) => {
    //   //use the id to get the project,
    //   let p = await project(key, id); //here to use the queue?
    //   //console.log(p);
    //   let project_type;
    //   //use the p to parse and save to database
    //   if (key === 'jobs') {
    //     project_type = 'job'; //we need singular object property later
    //     //console.log('JOB:');
    //     //console.log(p.job);
    //     //parseProject(p.job);
    //   } else if (key === 'volops') {
    //     project_type = 'volop';
    //     //console.log('VOLOP:');
    //     //console.log(p.volop);
    //   } else if (key === 'intenrships') {
    //     project_type = 'internship';
    //     //console.log('INTENSHIP:');
    //     //console.log(p.intenrship);
    //   }

    //   if (p && p[project_type]) {
    //     // its like obj.job or obj.volop
    //     // if ((await processProject(p[project_type])) === true) {
    //     //   res++;
    //     // }

    //     res++;
    //     console.log(p[project_type].name, res);
    //   }

    //   count++;
    //   if (count > 100) {
    //     console.log('SHOULD SLEEP!!!');
    //     await sleep(10000);
    //     count = 0;
    //   }
    //   console.log('Count is: ' + count);
    //   //all[key].push(p); //do we need this?
    //   //console.log(key, all[key].length);
    // });

    console.log(`${res} ${key} projects processed from Idealist.`);
  }

  //console.log(`${res} projects processed from Idealist.`);

  //return res; //this returns empty array!!!
};

// const getAllProjects = async (ids) => {
//   //return new Promise((resolve, reject) => {
//   //const all = {};
//   for (let [key, val] of Object.entries(ids)) {
//     console.log(key, val);

//     val.forEach(async (id) => {
//       all[key].push(await project(key, id));
//     });

//     return all;
//     //resolve(all);
//   }
//   //});
// };

(async () => {
  const project_ids = await getAllIds();
  //console.log(idss);
  await getAllProjects(project_ids);

  console.log('_________________END OF PROJECT PROCESSING_______________');
})();

async function getListings(project_types) {
  try {
    let since = sinceTimstamp; //get this from database
    let ttl = ttlStart;

    let hasMore = true;

    //since = await lastIdealistProject(project_types); //get from database
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

      hasMore = response.data.hasMore;
      ttl--;

      let projects = response.data[project_types]; //array

      if (response.status === 200) {
        if (projects.length > 0) {
          since = projects[projects.length - 1].updated; //check if exists
          projects.forEach((p) => {
            all_projects[project_types].push(p.id);
            //ids.push(p.id);

            //here instead adding them into array, get the projects and process them
          });
        } else {
          break;
        }
      }
    }
    return all_projects;
  } catch (error) {
    console.log(error.message);
  }
}

//get single project
async function project(project_types, id) {
  try {
    let proj = await axios.get(
      `https://www.idealist.org/api/v1/listings/${project_types}/${id}`,
      {
        // params: {
        //   //since: since,
        // },
        auth: {
          username: '743e1f3940484d7680130c748ed22758',
          password: '',
        },

        timeout: 0,
        httpAgent: new http.Agent({keepAlive: true}),
        httpsAgent: new https.Agent({keepAlive: true}),
      },
    );
    //console.log(proj.data);
    if (proj.status === 200) {
      return proj.data;
    } else {
      console.log(proj.status, proj.statusText, proj);
    }
  } catch (err) {
    console.log(err.message);
  }
}

// const lastIdealistProject = async (project_type) => {
//   const {row} = await app.db.get(
//     sql`select updated_at from projects where project_type = ${project_type} order by updated_at desc limit 1`,
//   );
//   return new Date(row.updated_at).toISOString;
//   //return row.updated_at;
// };

async function processProject(project) {
  try {
    let page_id, group_id;
    //create organization or get ID of existing one
    if (project.org) {
      page_id = await organizationFromProject(project.org);
    }

    //if project is volop, can have a group (create or find and get ID)
    if (project.group) {
      group_id = await groupFromProject(project.group);
    }

    if (page_id || group_id) return await saveProject(project); //return true or false
  } catch (err) {
    console.log(err.message);
  }
}

async function organizationFromProject(org) {
  const id = await getOrganization(org);

  if (id) {
    return id;
  } else {
    //create new organization
  }
}

async function groupFromProject(group) {
  const id = await getOrganization(group);

  if (id) {
    return id;
  } else {
    //create new organization
  }
}

async function saveProject(project) {}

async function parseProject(project) {
  console.log(project.name);
  //parse the project acording the existing model
  //create organization or get its ID
  //save to database along with organization ID
  //get some info back
}

async function getOrganization(org) {
  try {
    const name = org.name;

    //check if org egsist in database by its name
    const orgInDatabase = await app.db.get(
      sql`select id from organizations where name = ${name} limit 1`,
    );

    //if organization egsists, return its ID, else, create new org
    if (orgInDatabase) return orgInDatabase.id;
  } catch (err) {
    console.log(err.message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function init() {
  console.log(1);
  await sleep(5000);
  console.log(2);
}

console.log('________________THIS IS END OF LINE_________');
