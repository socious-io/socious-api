import axios from 'axios';
import sql from 'sql-template-tag';
import {app} from './src/index.js';

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
  const all = {jobs: [], volops: [], internships: []};
  for (let [key, val] of Object.entries(ids)) {
    console.log(key, val);

    val.forEach(async (id) => {
      let p = await project(key, id);
      //console.log(p);

      //use the p to parse and save to database
      if (key === 'jobs') {
        console.log('JOB:');
        //console.log(p.job);
        parseProject(p.job);
      } else if (key === 'volops') {
        console.log('VOLOP:');
        //console.log(p.volop);
      } else if (key === 'intenrships') {
        console.log('INTENSHIP:');
        //console.log(p.intenrship);
      }

      all[key].push(p);
    });
  }
  return all;
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
  const idss = await getAllIds();
  //console.log(idss);
  const pr = await getAllProjects(idss);

  console.log('resolved:____________________________');
  console.log(pr);
})();

async function getListings(project_types) {
  try {
    let since = '2022-09-07 08:02:07'; //get this from database
    let ttl = 10;
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
            username: '743e1f3940484d7680130c748ed22758',
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
          });
        } else {
          break;
        }
      }
    }
    return all_projects;
  } catch (error) {
    console.log(error);
  }
}

//get single project
async function project(project_types, id) {
  try {
    let proj = await axios.get(
      `https://www.idealist.org/api/v1/listings/${project_types}/${id}`,
      {
        params: {
          //since: since,
        },
        auth: {
          username: '743e1f3940484d7680130c748ed22758',
          password: '',
        },
      },
      {timeout: 0},
    );
    //console.log(proj.data);
    return proj.data;
  } catch (err) {
    console.log(err.message);
  }
}

// const project = (project_types, id) => {
//   //foreach listing data job...
//   return axios.get(
//     `https://www.idealist.org/api/v1/listings/${project_types}/${id}`,
//     {
//       params: {
//         //since: since,
//       },
//       auth: {
//         username: '743e1f3940484d7680130c748ed22758',
//         password: '',
//       },
//     },
//   );
// };

// const lastIdealistProject = async (project_type) => {
//   const {row} = await app.db.get(
//     sql`select updated_at from projects where project_type = ${project_type} order by updated_at desc limit 1`,
//   );
//   return new Date(row.updated_at).toISOString;
//   //return row.updated_at;
// };

async function parseProject(project) {
  console.log(project.name);
  //parse the project acording the existing model
  //create organization or get its ID
  //save to database along with organization ID
  //get some info back
}

async function getOrganization(project) {
  const org = project.org;
  const name = org.name || 'Unnamed';

  //check if org egsist in database by its name
  const orgInDatabase = await app.db.get(
    sql`select id from organizations where name = ${name} limit 1`,
  );

  //if organization egsists, return its ID, else, create new org
  if (orgInDatabase) return orgInDatabase.id;
}
