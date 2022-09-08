import axios from 'axios';
import sql from 'sql-template-tag';
//import {app} from './src/index.js';

const all_projects = {jobs: [], volops: [], internships: []};
const all = {jobs: [], volops: [], internships: []};
const proms = [];
const ids = [];

const getAllIds = () => {
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
  return new Promise((resolve, reject) => {
    for (let [key, val] of Object.entries(ids)) {
      console.log(key, val);

      val.forEach((id) => {
        all[key].push(project(key, id));
      });

      resolve(all);
    }
  });
};

(async () => {
  const idss = await getAllIds();
  //console.log(idss);
  const pr = await getAllProjects(idss);

  console.log('resolved:____________________________');
  console.log(pr);
})();

async function getListings(project_types) {
  try {
    let since = '2022-09-07 00:02:07'; //get this from database
    let ttl = 10;
    let hasMore = true;

    //since = await lastIdealistProject(project_types); //get from database

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
      //console.log(response.data, response.status, response.data.hasMore);

      hasMore = response.data.hasMore;
      ttl--;

      let projects = response.data[project_types]; //array

      if (response.status === 200) {
        //get projects ids into array...
        //ids.push(await project_id(response.data, project_types));
        //console.log(response.data);
        //console.log('PROJECT TYPES: ' + project_types);
        //console.log('Number of projects: ' + projects.length);
        // console.log(
        //   'Last updated_at: ' + projects[projects.length - 1].updated,
        // );
        if (projects.length > 0) {
          since = projects[projects.length - 1].updated; //check if exists
          projects.forEach((p) => {
            all_projects[project_types].push(p.id);
            //ids.push(p.id);
          });
        } else {
          break;
        }

        //console.log(project_id(projects));

        //project_id(response.data, project_types);
      }

      //const promices = await getProjects(project_types, ids);

      //console.log(promices);

      //const all = await Promise.all(promices);

      //console.log(all);
      //const project = async...

      //all.push(getProjects(project_types, ids));

      //console.log(collectProjects(project_types, ids));

      //iterate data and get every job
      //save the jobs using queue...
      //do the same for intenships and volops
    }
    return all_projects;
    //return ids;
  } catch (error) {
    console.log(error);
  }
}

// const getProject = async (project_types, id) => {
//   await project(project_types, id);
// };

// const getProjects = async (project_types, ids) => {
//   ids.forEach((id) => {
//     proms.push(project(project_types, id));
//   });
//   return proms;
// };

// const collectProjects = (project_types, ids) => {
//   ids.forEach((id) => {
//     all_projects[project_types].push(project(project_types, id));
//   });
// };

//console.log(all_projects);

//get single project
const project = async (project_types, id) => {
  //foreach listing data job...
  await axios.get(
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
  );
};

const lastIdealistProject = async (project_type) => {
  const {row} = await app.db.get(
    sql`select updated_at from projects where project_type = ${project_type} order by updated_at desc limit 1`,
  );
  return new Date(row.updated_at).toISOString;
  //return row.updated_at;
};
