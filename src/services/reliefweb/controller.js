import axios from 'axios';
import {configureHttp} from '../idealist/http-agent/configure-http.js';

import sql from 'sql-template-tag';
import {app} from '../../index.js';
import organization from '../../models/organization/index.js';
import media from '../../models/media/index.js';
import project from '../../models/project/index.js';

import {OrganizationType} from '@socious/data/src/enums.js';
import {iso3ToIso2} from './helpers.js';

const other_party_title = 'reliefweb job';
const url = 'https://api.reliefweb.int/v1/jobs';

const appName = 'socious';

export async function listProjects() {
  configureHttp();

  let last_id = await getLastReliefWebProjectId();
  let next = true;
  let ttl = 1;
  let limit = 5; //up to 1000, defaults to 1000

  let url_params =
    `?appName=${appName}&profile=full&limit=${limit}` +
    `&filter[field]=id&filter[value][from]=${last_id}&sort[]=id:asc`;

  let count = 0;
  try {
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
          //let last_record = data[data.length - 1];
          //last_id = last_record.id;
          last_id = data[data.length - 1].id;
        }

        for (let x = 0; x < data.length; x++) {
          if (await processProject(data[x].fields)) {
            count++;
          }
        }
      } else if (response.status < 500) {
        next = false;
        console.log(
          `Error while getting reliefweb projects: ${response.status}`,
        );
      } else {
        console.log(`Error getting reliefweb projects: ${response.status}`);
        console.log(response);
      }

      ttl--;
    }
    console.log(`${count} projects processed.`);
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
}

async function getLastReliefWebProjectId() {
  try {
    const row = await app.db.get(
      sql`SELECT other_party_id FROM projects WHERE other_party_title = ${other_party_title} 
      ORDER BY other_party_id DESC LIMIT 1`,
    );

    return row.other_party_id || 0;
  } catch (err) {
    if (err.status !== 400 && err.message !== 'Not matched') {
      console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message);
    }

    return 0;
  }
}

async function processProject(p) {
  console.log('Processing project...');
  const orgId = await createOrgFromProject(p);
  console.log(`Org id is: ${orgId}`);
  if (!orgId) return false;

  //save or update the project
  return await saveProject(p, other_party_title, orgId);
}

/**
 *
 * @param {object} p project
 * @param {integer} org_id
 * @returns boolean
 */
async function saveProject(p, type, orgId) {
  //console.log(pro);
  try {
    const body = await parseProject(p, type);

    // insert or update the project in DB
    const projFromDb = await getProjectFromDb(p);

    if (projFromDb) {
      await project.update(projFromDb.id, body);
      console.log('Project updated');
    } else {
      await project.insert(orgId, body);
      console.log('Project created');
    }

    return true;
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message, err);
    return false;
  }
}

async function parseProject(p, type) {
  if (!p.title) return false;

  const experienceLevel = await getExperienceLevel(p);
  let countryIso2 = null;
  if (p.country && p.country[0].iso3) {
    countryIso2 = await iso3ToIso2(p.country[0].iso3);
  }

  return {
    title: p.title,
    description: p['body-html']
      ? p['body-html']
      : p.body
      ? p.body
      : 'No information aviable',
    ...(countryIso2 && {country: countryIso2}),
    ...(experienceLevel && {experience_level: experienceLevel}),
    status: 'ACTIVE',
    ...(p.date?.closing && {expires_at: p.date.closing}),
    other_party_id: p.id,
    other_party_title: type,
    ...(p.url && {other_party_url: p.url}),
    ...(p.date?.changed && {updated_at: p.date.changed}),
  };
}

async function getExperienceLevel(p) {
  if (p.experience && p.experience[0].name) {
    let exp = p.experience[0].name;
    let secondNum, firstNum;
    if (Array.from(exp)[2]) {
      firstNum = parseInt(Array.from(exp)[2]);
    }
    if (Array.from(exp)[0]) {
      secondNum = parseInt(Array.from(exp)[0]);
    }
    if (!isNaN(firstNum) && !isNaN(secondNum)) {
      return Math.round((firstNum + secondNum) / 2);
    }
    return 0;
  }
}

async function getProjectFromDb(p) {
  try {
    const pr = await app.db.get(
      sql`SELECT id FROM projects WHERE other_party_id = ${p.id}`,
    );

    return pr.id;
  } catch (err) {
    if (err.status !== 400 && err.message !== 'Not matched') {
      console.log(err.message, err.status);
    }
    return false;
  }
}

////// ORGANIZATION FUNCTIONS ///////////////

async function createOrgFromProject(p) {
  try {
    //console.log('Attempt to create org from project');
    const org = p.source[0];
    //console.log(`Org from project is: ${org.id}`);
    if (!org) {
      console.log('\x1b[31m%s\x1b[0m', 'Organization not found in project');
      return false; //project has to have organization???
    }

    const orgName = org.longname ? org.longname : org.name ? org.name : null;

    if (!orgName) {
      console.log(
        '\x1b[31m%s\x1b[0m',
        'Organization name not found in project',
      );
      return false;
    }

    //console.log('checking if org exsist in table...');
    //check if org exist in table then update or insert // DO WE UPDATE???
    const org_id_from_db = await findOrgFromTable(orgName);

    //console.log(`Org from table is ${org_id_from_db}`);
    if (org_id_from_db) {
      return org_id_from_db;
    } else {
      // create new organization
      //console.log(`Creating new organization...`);
      const org = await getOrganizationFromApi(p);
      //console.log(`Org from the api is ${org.id}`);
      const body = await parseOrganization(org);
      //console.log(`Org Body is:`, body);
      const newOrg = await organization.insert(null, body);

      //save logo to medias and update org with its uuid
      if (newOrg && org?.logo?.url) {
        const logo = await saveOrgLogoInMedias(newOrg.id, org.logo.url);

        await saveLogoIdInOrganization(logo.id, newOrg.id);
      }
      //console.log(`New Org id is: ${newOrg.id}`);
      return newOrg.id;
    }
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
    return false;
  }
}

/**
 *
 * @param {string} org_name
 * @returns uuid | false
 */
async function findOrgFromTable(org_name) {
  try {
    const orgFromTable = await app.db.get(
      sql`SELECT id FROM organizations WHERE name = ${org_name}`,
    );
    //console.log(`Org from table is: ${orgFromTable.id}`);
    return orgFromTable.id;
  } catch (err) {
    if (err.status !== 400 && err.message !== 'Not matched') {
      //we dont need to log status 400 - 'not matched' error
      console.log('\x1b[31m%s\x1b[0m', err.message);
    }
    return false;
  }
}

async function getOrganizationFromApi(p) {
  let org = p.source;
  const orgUrl = org ? org[0].href : null;
  //console.log(org);
  try {
    if (orgUrl) {
      org = await axios.get(orgUrl, {
        headers: {
          Accept: 'application/json',
        },
      });
      org = org.data?.data[0].fields;
      //console.log(org);
      return org;
    }
    return false;
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
  }
}

async function saveOrgLogoInMedias(id, logo) {
  try {
    // save logo image
    return await media.insert(id, 'logo', logo);
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
    return false;
  }
}

//save logo uuid into organizations table
async function saveLogoIdInOrganization(imageId, newOrgId) {
  try {
    await app.db.query(sql`UPDATE organizations 
    SET image = ${imageId} WHERE id = ${newOrgId}`);
    console.log('Saved logo to organization');
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
    return false;
  }
}

async function parseOrganization(org) {
  try {
    if (!org) return false;

    const shName = await shortname(org);
    const orgBio = await organizationBio(org);
    const orgDesc = await organizatioDescription(org);
    const type = await orgType(org);

    let countryIso2 = null;
    if (org.country && org.country[0].iso3) {
      countryIso2 = await iso3ToIso2(org.country[0].iso3);
    }

    return {
      name: org.name,
      ...(shName && {shortname: shName}),
      ...(orgBio && {bio: orgBio}),
      ...(orgDesc && {description: orgDesc}),
      type: type,
      ...(countryIso2 && {country: countryIso2}),
      ...(org.homepage && {website: org.homepage}),
      social_causes: [],
    };
    //}
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
    return false;
  }
}

async function organizationBio(org) {
  if (org.description) {
    return org.description;
  }
  return null;
}

async function organizatioDescription(org) {
  return org['description-html'] ? org['description-html'] : null;
}

async function orgType(org) {
  let type = 'OTHER';

  if (org.type?.name) {
    let tempType = org.type.name.toUpperCase();

    if (Object.values(OrganizationType).includes(tempType)) {
      type = tempType;
    }
  }

  return type;
}

async function shortname(org) {
  try {
    let shortname = null;

    //get from org name
    if (!org.name) return false;

    shortname = org.name.replaceAll(' ', '_').replace(/[^a-zA-Z_-]/g, '');

    while (shortname.match(/_{2,}|-{2,}|_-|-_|\s/g)) {
      shortname = shortname.replace(/_{2,}|-{2,}|_-|-_|\s/g, '_');
    }

    while (!shortname[0].match(/[a-zA-Z0-9]/) && shortname.length > 0) {
      shortname = shortname.substring(1);
    }

    shortname =
      shortname.toLowerCase().slice(0, 32) +
      Math.floor(1000 + Math.random() * 9000);

    return shortname;
  } catch (err) {
    console.log(
      `Error parsing shortname for organization ${org.id}: ${err.message}`,
    );

    return false;
  }
}
