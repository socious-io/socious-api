import sql from 'sql-template-tag';
import {app} from '../../index.js';
import project from '../../models/project/index.js';
import {createOrgFromProject} from './organization.js';
import {iso3ToIso2} from './helpers.js';

const other_party_title = 'reliefweb job';

export async function getLastReliefWebProjectId() {
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

export async function processProject(p) {
  const orgId = await createOrgFromProject(p);

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
  try {
    const body = await parseProject(p, type);

    // insert or update the project in DB
    const projFromDb = await getProjectFromDb(p);

    if (projFromDb) {
      await project.update(projFromDb.id, body);
    } else {
      await project.insert(orgId, body);
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
      let res = Math.round((firstNum + secondNum) / 2);

      return res < 4 ? res : 4;
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
