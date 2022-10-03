import axios from 'axios';

import sql from 'sql-template-tag';
import {app} from '../../index.js'; //'./app.js';

import {organizationFromProject} from './projectOrganization.js';
import project from '../../models/project/index.js';

/**
 * Get single project from Idealist
 *
 * @param {string} projectTypes
 * @param {string} id
 * @returns object || void
 */
export const getProject = async function (projectTypes, id) {
  try {
    let proj = await axios.get(
      `https://www.idealist.org/api/v1/listings/${projectTypes}/${id}`,
      {
        auth: {
          username: process.env.IDEALIST_TOKEN, //'743e1f3940484d7680130c748ed22758',
          password: '',
        },

        timeout: 0,
      },
    );

    if (proj.status === 200) {
      return proj.data;
    } else {
      console.log('\x1b[31m%s\x1b[0m', proj.status + ', ' + proj.statusText);
    }
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
  }
};

export const lastIdealistProject = async function (projectType) {
  try {
    projectType = projectType.slice(0, -1);

    const row = await app.db.get(
      sql`SELECT updated_at FROM projects WHERE other_party_title = ${projectType} ORDER BY updated_at DESC LIMIT 1`,
    );

    return new Date(row.updated_at).toISOString();
  } catch (err) {
    if (err.status !== 400 && err.message !== 'Not matched')
      console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message);
    return null;
  }
};

export const processProject = async function (p, type) {
  try {
    let orgId;

    //create organization or get ID of existing one
    orgId = await organizationFromProject(p);

    //if project is volop, can have a group (create or find and get ID)
    // if (project.group) {
    //   group_id = await groupFromProject(project.group);
    // }

    if (orgId) return await saveProject(p, type, orgId); //return true or false
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
  }
};

async function saveProject(pro, type, orgId) {
  try {
    const projectName = pro.name;

    if (!pro.name) return false;

    const paymentType = await getPaymentType(pro);
    const remotePreference = await getRemotePreference(pro);

    const paymentScheme =
      pro.salaryPeriod && pro.salaryPeriod == 'HOUR' ? 'HOURLY' : 'FIXED';
    const experienceLevel = await getExperienceLevel(pro);

    const body = {
      title: projectName,
      description: pro.description ? pro.description : 'No information',
      remote_preference: remotePreference,
      payment_type: paymentType,
      payment_scheme: paymentScheme,
      ...(pro.salaryCurrency && {payment_currency: pro.salaryCurrency}),
      ...(pro.salaryMinimum && {
        payment_range_lower: pro.salaryMinimum.toString(),
      }),
      ...(pro.salaryMaximum && {
        payment_range_higher: pro.salaryMaximum.toString(),
      }),
      ...(experienceLevel && {experience_level: experienceLevel}),
      status: 'ACTIVE',
      ...(pro.address?.country && {country: pro.address.country}),
      ...(pro.address?.city && {city: pro.address.city}),
      ...(pro.expires && {expires_at: pro.expires}), //check if works for date
      other_party_id: pro.id,
      other_party_title: type,
      ...(pro.url && pro.url.en && {other_party_url: pro.url.en}),
      updated_at: pro.updated,
      // updated_at is important to find the last downloaded project from Idealist
      // they are sorted by updated_at on their listings and it is used into the 'since' param
      // when getting the listings
    };

    // insert or update the project in DB
    const projFromDb = await getProjectFromDb(pro);

    if (projFromDb) {
      //update project
      await project.update(projFromDb.id, body);
    } else {
      //create new project
      await project.insert(orgId, body);
    }

    return true;
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message, err);
    return false;
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

// PARSING FUNCTIONS FOR PROJECT

/**
 * get payment type
 *
 * @param object
 * @return string
 */
async function getPaymentType(p) {
  if (
    (p.salaryMinimum && p.salaryMinimum > 0) ||
    (p.salaryMaximum && p.salaryMaximum > 0) ||
    (p.paid && p.paid == true)
  ) {
    return 'PAID';
  } else {
    return 'VOLUNTEER';
  }
}

/**
 * get project remote preference
 *
 * @param object
 * @return string
 */
async function getRemotePreference(p) {
  if (p.remoteOk && p.remoteOk === true) {
    if (p.remoteTemporary && p.remoteTemporary === true) {
      return 'HYBRID';
    }
    return 'REMOTE';
  } else {
    return 'ONSITE';
  }
}

/**
 * project experience level
 *
 * @param object
 * @return integer
 */
async function getExperienceLevel(p) {
  const pr_lev = {
    NONE: 1,
    ENTRY_LEVEL: 2,
    MANAGERIAL: 3,
    INTERMEDIATE: 3,
    PROFESSIONAL: 4,
    DIRECTOR: 4,
    EXECUTIVE: 4,
    EXPERT: 4,
  };

  if (p.professionalLevel && pr_lev[p.professionalLevel]) {
    return pr_lev[p.professionalLevel];
  }

  return 0;
}
