import axios from 'axios'

import sql from 'sql-template-tag'
import { app } from '../../index.js'
import organization from '../../models/organization/index.js'
import media from '../../models/media/index.js'
import { OrganizationType } from '@socious/data/src/enums.js'
import { iso3ToIso2 } from './helpers.js'

/**
 *
 * @param p
 * @example
 */
export async function createOrgFromProject(p) {
  try {
    let org = p.source[0]

    if (!org) {
      console.log('\x1b[31m%s\x1b[0m', 'Organization not found in project')
      return false // project has to have organization???
    }

    if (!org.name) {
      console.log('\x1b[31m%s\x1b[0m', 'Organization name not found in project')
      return false
    }

    // check if org exist in table then update or insert // DO WE UPDATE???
    const orgId = await findOrgFromTable(org)

    if (orgId) return orgId

    // create new organization

    org = await getOrganizationFromApi(p)

    if (!org) return false

    const body = await parseOrganization(org)

    const newOrg = await organization.insert(null, body)

    // save logo to medias and update org with its uuid
    if (newOrg && org?.logo?.url) {
      const logo = await saveOrgLogoInMedias(newOrg.id, org.logo.url)

      await saveLogoIdInOrganization(logo.id, newOrg.id)
    }

    return newOrg.id
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message)
    return false
  }
}

/**
 *
 * @param org_name
 * @param org
 * @returns Uuid | false.
 * @example
 */
async function findOrgFromTable(org) {
  try {
    const orgFromTable = await app.db.get(
      sql`SELECT id FROM organizations 
        WHERE other_party_id=${org.id} OR 
        name = ${org.name} OR
        website = ${org.url} 
      LIMIT 1`
    )

    if (!org.other_party_id) {
      await app.db.query(sql`
        UPDATE organizations SET 
          other_party_id=${org.other_party_id},
          other_party_title='RELIEFWEB',
          other_party_url=website,
          updated_at=now()
        WHERE id=${orgFromTable.id}
      `)
    }

    return orgFromTable.id
  } catch (err) {
    if (err.status !== 400 && err.message !== 'Not matched') {
      // we dont need to log status 400 - 'not matched' error
      console.log('\x1b[31m%s\x1b[0m', err.message)
    }
    return false
  }
}

/**
 *
 * @param p
 * @example
 */
async function getOrganizationFromApi(p) {
  let org = p.source
  const orgUrl = org ? org[0].href : null
  try {
    if (orgUrl) {
      org = await axios.get(orgUrl, {
        headers: {
          Accept: 'application/json'
        }
      })
      org = org.data[0].fields
      return org
    }
    return false
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', 'Error getting organization from ReliefWeb: ' + err.message)
    return false
  }
}

/**
 *
 * @param id
 * @param logo
 * @example
 */
async function saveOrgLogoInMedias(id, logo) {
  try {
    // save logo image
    return await media.insert(id, 'logo', logo)
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message)
    return false
  }
}

// save logo uuid into organizations table
/**
 *
 * @param imageId
 * @param newOrgId
 * @example
 */
async function saveLogoIdInOrganization(imageId, newOrgId) {
  try {
    await app.db.query(sql`UPDATE organizations 
    SET image = ${imageId} WHERE id = ${newOrgId}`)
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message)
    return false
  }
}

/**
 *
 * @param org
 * @example
 */
async function parseOrganization(org) {
  try {
    if (!org || org === undefined) return false

    const shName = await shortname(org)
    const orgBio = await organizationBio(org)
    const orgDesc = await organizatioDescription(org)
    const type = await orgType(org)

    let countryIso2 = null
    if (org.country && org.country[0].iso3) {
      countryIso2 = await iso3ToIso2(org.country[0].iso3)
    }

    return {
      name: org.name,
      shortname: shName,
      bio: orgBio,
      description: orgDesc,
      type,
      country: countryIso2,
      website: org.homepage || org.url,
      social_causes: [],
      other_party_id: org.id,
      other_party_url: org.homepage || org.url,
      other_party_title: 'RELIEFWEB'
    }
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message)
    return false
  }
}

/**
 *
 * @param org
 * @example
 */
async function organizationBio(org) {
  if (org.description) {
    return org.description
  }
  return null
}

/**
 *
 * @param org
 * @example
 */
async function organizatioDescription(org) {
  return org['description-html'] ? org['description-html'] : null
}

/**
 *
 * @param org
 * @example
 */
async function orgType(org) {
  let type = 'OTHER'

  if (org.type?.name) {
    const tempType = org.type.name.toUpperCase()

    if (Object.values(OrganizationType).includes(tempType)) {
      type = tempType
    }
  }
  return type
}

/**
 *
 * @param org
 * @example
 */
async function shortname(org) {
  try {
    let shortname = null

    if (!org.name || org.name === undefined) return false

    shortname = org.name.replaceAll(' ', '_').replace(/[^a-zA-Z_-]/g, '')

    while (shortname.match(/_{2,}|-{2,}|_-|-_|\s/g)) {
      shortname = shortname.replace(/_{2,}|-{2,}|_-|-_|\s/g, '_')
    }

    while (!shortname[0].match(/[a-zA-Z0-9]/) && shortname.length > 0) {
      shortname = shortname.substring(1)
    }

    shortname = shortname.toLowerCase().slice(0, 32) + Math.floor(1000 + Math.random() * 9000)

    return shortname
  } catch (err) {
    console.log(`Error parsing shortname for organization ${org.id}: ${err.message}`)

    return false
  }
}
