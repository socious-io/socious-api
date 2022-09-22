import axios from 'axios';

import sql from 'sql-template-tag';
import {app} from '../../index.js'; //'./app.js';
import organization from '../../models/organization/index.js';

const other_party_title = 'reliefweb job';
const url = 'https://api.reliefweb.int/v1/jobs';

const appName = 'socious';

export async function collectProjects() {
  try {
    let last_id = await getLastReliefWebProjectId();
    let next = true;
    let ttl = 1;
    let limit = 3;

    let url_params = `?appName=${appName}&profile=full&limit=${limit}&filter[field]=id&filter[value][from]=${last_id}&sort[]=id:asc`;

    let count = 0;

    while (ttl > 0 && next === true) {
      const response = await axios
        .get(`${url}${url_params}`, {
          headers: {
            Accept: 'application/json',
          },
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
            throw new Error(
              `Error in response getting listings, ${error.response.status}`,
            );
            //console.log(error.response.headers);
          } else if (error.request) {
            throw new Error(
              `Error in request getting listings for, ${error.request}`,
            );
          } else {
            console.log(`Other error getting listing for, ${error.message}`);
          }
        });

      if (response.status === 200) {
        console.log('Items: ' + response.data.data.length);

        const data = response.data.data;

        if (!response.data.links?.next) {
          next = false;
        }

        if (data.length > 0) {
          let last_record = data[data.length - 1];
          last_id = last_record.id;
          //or last_id = data[data.length - 1].id;
        }

        data.forEach(async (p) => {
          console.log(p.id, p.fields);

          if (await processProject(p)) {
            count++;
          }
        });

        //hasMore = response.data.hasMore;

        //let projects = response.data[project_types]; //array

        // if (projects.length > 0) {
        //   //get the since from this stack of project listing
        //   since = projects[projects.length - 1].updated;

        //   for (let y = 0; y < projects.length; y++) {
        //     all_projects.push({id: projects[y].id, processed: 0});
        //   }
        // }
      } else if (response.status < 500) {
        //we will stop listings of this type for errors ~400
        next = false;
      } else {
        console.log(`Error getting reliefweb projects: ${response.status}`);
        console.log(response);
      }

      ttl--;
    }
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
}

// async function getCollectedProjects(collection) {
//   //
// }

async function processProject(p) {
  const org_id = await createOrgFromProject(p);

  if (!org_id) return false;

  //save or update the project
  return await saveProject(p, org_id);
}

async function getLastReliefWebProjectId() {
  try {
    const row = await app.db.get(
      sql`SELECT other_party_id FROM projects WHERE other_party_title = ${other_party_title} ORDER BY other_party_id DESC LIMIT 1`,
    );

    return row.other_party_id || 0;
  } catch (err) {
    if (err.status !== 400 && err.message !== 'not matched') {
      console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message);
    }

    return 0;
  }
}

async function createOrgFromProject(p) {
  try {
    const org = p.source;

    if (!org) {
      console.log('Organization not found in project');
      return false; //project has to have organization???
    }

    const org_name = org.fields?.longname
      ? org.fields.longname
      : org.fields?.name
      ? org.fields.name
      : null;

    if (!org_name) {
      console.log('Organization name not found in project');
      return false;
    }

    //check if org exist in table then update or insert // DO WE UPDATE???
    const org_id_from_db = await findOrgFromTable(org_name);

    if (org_id_from_db) {
      return org_id_from_db;
    } else {
      // create new organization

      //get org ('source') from project
      const body = await parseOrganizationFromProject(p);

      const newOrg = await organization.insert(null, body);

      return newOrg.id;
    }
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message);
    return false;
  }
}

/**
 *
 * @param {string} org_name
 * @returns integer | false
 */
async function findOrgFromTable(org_name) {
  try {
    const orgFromTable = await app.db.get(
      sql`SELECT id FROM organizations WHERE name = ${org_name}`,
    );

    return orgFromTable.id;
  } catch (err) {
    if (err.status !== 400 && err.message !== 'not matched') {
      //we dont need to log status 400 - 'not matched' error
      console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message);
    }
    return false;
  }
}

/**
 *
 * @param {object} p
 * @param {integer} org_id
 * @returns boolean
 */
async function saveProject(p, org_id) {}

async function parseOrganizationFromProject(p) {
  let org = p.fields?.source;
  const org_url = org ? org[0].href : null;
  if (org_url) {
    org = await axios.get(org_url, {
      headers: {
        Accept: 'application/json',
      },
    });
  }

  const body = {
    name: org.name,
    ...(sh_name && {shortname: sh_name}),
    ...(orgBio && {bio: orgBio}),
    ...(orgBio && {description: orgBio}),
    type: type,
    ...(org.address && org.address.city && {city: org.address.city}),
    ...(org.address && org.address.full && {address: org.address.full}),
    ...(org.address && org.address.country && {country: org.address.country}),
    ...(org.url && org.url.en && {website: org.url.en}),
    social_causes: [],
  };
}
