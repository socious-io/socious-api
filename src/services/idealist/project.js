import axios from 'axios'

import sql from 'sql-template-tag'
import { app } from '../../index.js' // './app.js';

import { organizationFromProject } from './projectOrganization.js'
import project from '../../models/project/index.js'

/**.
 * Get single project from Idealist
 *
 * @param {string} projectTypes
 * @param {string} id
 * @returns object || void
 * @example
 */
export const getProject = async function (projectTypes, id) {
  const proj = await axios.get(`https://www.idealist.org/api/v1/listings/${projectTypes}/${id}`, {
    auth: {
      username: process.env.IDEALIST_TOKEN,
      password: ''
    },

    timeout: 0
  })

  if (proj.status !== 200) throw Error('fetching project')

  return proj.data
}

export const lastIdealistProject = async function (projectType) {
  try {
    projectType = projectType.slice(0, -1)

    const row = await app.db.get(
      sql`SELECT updated_at FROM projects WHERE other_party_title = ${projectType} ORDER BY updated_at DESC LIMIT 1`
    )

    return new Date(row.updated_at).toISOString()
  } catch (err) {
    if (err.status !== 400 && err.message !== 'Not matched') {
      console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message)
    }
    return null
  }
}

export const processProject = async function (p, type) {
  try {
    let orgId

    // create organization or get ID of existing one
    orgId = await organizationFromProject(p)

    // if project is volop, can have a group (create or find and get ID)
    // if (project.group) {
    //   group_id = await groupFromProject(project.group);
    // }

    if (orgId) return await saveProject(p, type, orgId) // return true or false
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message)
  }
}

/**
 *
 * @param pro
 * @param type
 * @param orgId
 * @example
 */
async function saveProject(pro, type, orgId) {
  try {
    const projectName = pro.name

    if (!pro.name) return false

    const paymentType = await getPaymentType(pro)
    const remotePreference = await getRemotePreference(pro)

    const paymentScheme = pro.salaryPeriod && pro.salaryPeriod == 'HOUR' ? 'HOURLY' : 'FIXED'
    const experienceLevel = await getExperienceLevel(pro)

    const body = {
      title: projectName,
      description: pro.description ? pro.description : 'No information',
      remote_preference: remotePreference,
      payment_type: paymentType,
      payment_scheme: paymentScheme,
      payment_currency: pro.salaryCurrency,
      payment_range_lower: pro.salaryMinimum?.toString(),
      payment_range_higher: pro.salaryMaximum?.toString(),
      experience_level: experienceLevel,
      status: 'ACTIVE',
      country: pro.address?.country,
      city: pro.address?.city,
      expires_at: pro.expires, // check if works for date
      other_party_id: pro.id,
      other_party_title: type,
      other_party_url: pro.url?.en,
      updated_at: pro.updated
      // updated_at is important to find the last downloaded project from Idealist
      // they are sorted by updated_at on their listings and it is used into the 'since' param
      // when getting the listings
    }

    // insert or update the project in DB
    const projFromDb = await getProjectFromDb(pro)

    if (projFromDb) {
      // update project
      await project.update(projFromDb.id, body)
    } else {
      // create new project
      await project.insert(orgId, body)
    }

    return true
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message, err)
    return false
  }
}

/**
 *
 * @param p
 * @example
 */
async function getProjectFromDb(p) {
  try {
    const pr = await app.db.get(sql`SELECT id FROM projects WHERE other_party_id = ${p.id}`)

    return pr.id
  } catch (err) {
    if (err.status !== 400 && err.message !== 'Not matched') {
      console.log(err.message, err.status)
    }
    return false
  }
}

// PARSING FUNCTIONS FOR PROJECT

/**.
 * Get payment type
 *
 * @param object
 * @param p
 * @return string
 * @example
 */
/**
 *
 * @param p
 * @example
 */
async function getPaymentType(p) {
  if (
    (p.salaryMinimum && p.salaryMinimum > 0) ||
    (p.salaryMaximum && p.salaryMaximum > 0) ||
    (p.paid && p.paid == true)
  ) {
    return 'PAID'
  } else {
    return 'VOLUNTEER'
  }
}

/**.
 * Get project remote preference
 *
 * @param object
 * @param p
 * @return string
 * @example
 */
/**
 *
 * @param p
 * @example
 */
async function getRemotePreference(p) {
  if (p.remoteOk && p.remoteOk === true) {
    if (p.remoteTemporary && p.remoteTemporary === true) {
      return 'HYBRID'
    }
    return 'REMOTE'
  } else {
    return 'ONSITE'
  }
}

/**.
 * Project experience level
 *
 * @param object
 * @param p
 * @return integer
 * @example
 */
/**
 *
 * @param p
 * @example
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
    EXPERT: 4
  }

  if (p.professionalLevel && pr_lev[p.professionalLevel]) {
    return pr_lev[p.professionalLevel]
  }

  return 0
}

/**.
 * Set project status to EXPIRE
 *
 * @param title
 * @param {array} ids
 * @returns int
 * @example
 */
/**
 *
 * @param title
 * @param ids
 * @example
 */
export async function expireProjects(title, ids) {
  let count = 0

  try {
    const res = await app.db.query(sql`
    UPDATE projects 
    SET status = 'EXPIRE',
      expires_at = NOW()
    WHERE status <> 'EXPIRE' AND 
      other_party_id = ANY(${ids} AND 
      other_part_title=${title}
    `)

    if (res.rowCount > 0) {
      count = res.rowCount
      // console.log(`${count} projects updated to EXPIRE.`);
    }
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message)
  }

  return count
}
