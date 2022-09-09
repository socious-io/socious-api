import axios from 'axios';
import https from 'https';
import http from 'http';

import sql from 'sql-template-tag';
import {app} from './src/index.js';

import organization from './src/models/organization/index.js';
import {exit} from 'process';

const sinceTimstamp = '2022-09-09 01:22:07';
const ttlStart = 10;
const idealistToken = '743e1f3940484d7680130c748ed22758';

const all_projects = {jobs: [], volops: [], internships: []};

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
  for (let [key, val] of Object.entries(ids)) {
    //for each type of project (job, volop and intenrship)
    let res = 0;
    let count = 0;

    for (let x = 0; x < val.length; x++) {
      let id = val[x];
      count++;
      console.log(x + ': ' + key, id);

      let p = await project(key, id); //here to use the queue?

      let project_type;

      if (key === 'jobs') {
        project_type = 'job'; //we need singular object property later
      } else if (key === 'volops') {
        project_type = 'volop';
      } else if (key === 'internships') {
        project_type = 'internship';
      }

      if (p && p[project_type]) {
        // its like obj.job or obj.volop
        if ((await processProject(p[project_type], project_type)) === true) {
          res++;
        }

        //res++;
        //console.log(p[project_type].name, res);
      }

      if (count > 50) {
        console.log('Waiting 10 seconds...');
        await sleep(10000);
        count = 0;
      }
    }

    console.log(`${res} ${key} projects processed from Idealist.`);
  }
};

//Call the functionality...
(async () => {
  const project_ids = await getAllIds();

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

async function processProject(project, type) {
  console.log(project.name, type);

  try {
    let page_id;
    //create organization or get ID of existing one

    page_id = await organizationFromProject(project);
    console.log(`Org ID that we got in processProject is: ${page_id}`);
    return true;
    //if project is volop, can have a group (create or find and get ID)
    // if (project.group) {
    //   group_id = await groupFromProject(project.group);
    // }

    //if (page_id) return await saveProject(project); //return true or false
  } catch (err) {
    console.log(err.message);
  }
}

async function organizationFromProject(project) {
  const org = project.org || null;

  if (!org) return false;

  const id = await getOrganization(org);

  console.log(`organization ID from database is: ${id}`);

  if (id) {
    return id;
  } else {
    //create new organization

    try {
      const orgBio = await organizationBio(org);
      console.log(`Org bio is: ${orgBio}`);

      const body = {
        name: org.name,
        ...(orgBio && {bio: orgBio}),
        ...(orgBio && {description: orgBio}),
        email: project.applyEmail ? project.applyEmail : 'no@email.com',
        type: org.orgType ? org.orgType : 'OTHER',
        ...(org.address && org.address.city && {city: org.address.city}),
        ...(org.address && org.address.full && {address: org.address.full}),
        ...(org.address &&
          org.address.country && {country: org.address.country}),
        ...(org.url && org.url.en && {website: org.url.en}),
        social_causes: [],
      };

      console.log(body);

      // const body = {
      //   name: org.name,
      //   bio: orgBio || 'No data',
      //   description: orgBio || 'No data',
      //   email: project.applyEmail ? project.applyEmail : '',
      //   phone: undefined,
      //   type: org.orgType ? org.orgType : 'OTHER',
      //   city: org.address ? (org.address.city ? org.address.city : '') : '',
      //   address: org.address
      //     ? org.address.full
      //       ? org.address.full
      //       : null
      //     : null,
      //   country: org.address
      //     ? org.address.country
      //       ? org.address.country
      //       : null
      //     : null,
      //   website: org.url ? (org.url.en ? org.url.en : null) : null,
      //   social_causes: [],
      //   mobile_country_code: '',
      //   //image: null,
      // };

      const newOrg = await organization.insert(body);

      return newOrg.id;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
}

/**
 * return formatted organization bio from "areasOfFocus", "orgType" and "url"
 *
 * @param org
 * @return string
 */
async function organizationBio(org) {
  let output = '';
  if (org.areasOfFocus) {
    output = 'Areas of focus: ';
    if (Array.isArray(org.areasOfFocus)) {
      output += org.areasOfFocus.join(', ');
    } else if (typeof org.areasOfFocus === 'string') {
      output += org.areasOfFocus;
    }
    output += '\n';
  }
  if (org.orgType) {
    output += ' Organization type: ' + org.orgType + '\n';
  }

  if (org.url && org.url.en) {
    output += ' Organization url: ' + org.url.en;
  }

  return output;
}

// async function groupFromProject(project) {

//   const group = project.group || null;

//   const id = await getOrganization(group);

//   if (id) {
//     return id;
//   } else {
//     //create new organization
//   }
// }

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
      sql`SELECT id FROM organizations WHERE name = ${name} LIMIT 1`,
    );
    console.log(`Organization from database: ${orgInDatabase}`);
    //if organization egsists, return its ID, else, create new org
    if (orgInDatabase) return orgInDatabase.id;
  } catch (err) {
    console.log(err.message);
    return false;
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
