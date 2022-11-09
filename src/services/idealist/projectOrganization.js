import sql from 'sql-template-tag';
import {app} from '../../index.js';

import organization from '../../models/organization/index.js';
import media from '../../models/media/index.js';
import {OrganizationType} from '@socious/data/src/enums.js';

/**
 * creates new organization from project if it doesn't exists in database
 * @param object
 * @return integer || false
 */
export const organizationFromProject = async function (project) {
  const org = project.org || null;

  if (!org || !org.name) return false;

  //check if org exist in database
  const id = await getOrganization(org);

  if (id) return id;
    //create new organization

    try {
      const orgBio = await organizationBio(org);

      let type = 'OTHER';
      if (
        org.orgType &&
        Object.values(OrganizationType).includes(org.orgType)
      ) {
        type = org.orgType;
      }

      let shName = null;
      shName = await shortname(org);

      //add dynamically properties to the request
      const body = {
        name: org.name,
        bio: orgBio,
        shortname: shName,
        type: type,
        city: org.address?.city,
        address: org.address?.full,
        country: org.address?.country,
        website: org.url?.en,
        social_causes: [],
        other_party_id: org.id,
        other_party_url: org.url?.en,
        other_party_title: 'IDEALIST'
      };

      //save organization to database
      const identityId = null;
      const newOrg = await organization.insert(identityId, body);

      if (org.logo) {
        // save logo image
        const newMedia = await media.insert(newOrg.id, 'logo', org.logo);

        //save logo uuid into organizations table
        await app.db.query(sql`UPDATE organizations 
        SET image = ${newMedia.id} WHERE id = ${newOrg.id}`);
      }

      return newOrg.id;
    } catch (err) {
      console.log('\x1b[31m%s\x1b[0m', err.message, err);
      return false;
    }
};

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

async function getOrganization(org) {
  try {

    //check if org egsist in database by its name
    const orgInDatabase = await app.db.get(
      sql`SELECT id FROM organizations 
        WHERE other_party_id=${org.id} OR 
        name = ${org.name} OR 
        website = ${org.url?.en} 
      LIMIT 1`,
    );

    if (!org.other_party_id)
      await app.db.query(sql`
        UPDATE organizations SET 
          other_party_id=${org.other_party_id},
          other_party_title='IDEALIST',
          other_party_url=website,
          updated_at=now()
        WHERE id=${orgInDatabase.id}
      `)

    return orgInDatabase.id;
  } catch (err) {
    if (err.status !== 400 && err.message !== 'not matched') {
      //we dont need to log status 400 - 'not matched' error
      console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message);
    }
    return false;
  }
}

async function shortname(org) {
  try {
    let shortname = null;

    if (org.url?.en) {
      //get from org url
      const url_string = new URL(org.url.en).pathname;

      const chunks = url_string.split('/');

      shortname = chunks[chunks.length - 1];
      shortname = decodeURI(shortname);
      shortname = shortname.slice(32);
    } else {
      //get from org name
      if (!org.name) return null;
      shortname = org.name.replaceAll(' ', '_').replace(/[^a-zA-Z_-]/g, '');
    }

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
