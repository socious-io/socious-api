import sql from 'sql-template-tag';
import {app} from './app.js'; //'../../index.js';

import organization from '../../models/organization/index.js';
import media from '../../models/media/index.js';
import {Type} from '../../models/organization/enums.js';

/**
 * creates new organization from project if it doesn't exists in database
 * @param object
 * @return integer || false
 */
export const organizationFromProject = async function (project) {
  const org = project.org || null;

  if (!org) return false;

  const id = await getOrganization(org);

  //console.log(`organization ID from database is: ${id}`);

  if (id) {
    return id;
  } else {
    //create new organization

    try {
      const orgBio = await organizationBio(org);
      //console.log(`Org bio is: ${orgBio}`);

      let type = 'OTHER';
      if (org.orgType && Object.values(Type).includes(org.orgType)) {
        type = org.orgType;
      }

      //add dynamically properties to the request
      const body = {
        name: org.name,
        ...(orgBio && {bio: orgBio}),
        ...(orgBio && {description: orgBio}),
        email: project.applyEmail ? project.applyEmail : 'no@email.com', //not good - beter to change in model validation
        type: type,
        ...(org.address && org.address.city && {city: org.address.city}),
        ...(org.address && org.address.full && {address: org.address.full}),
        ...(org.address &&
          org.address.country && {country: org.address.country}),
        ...(org.url && org.url.en && {website: org.url.en}),
        social_causes: [],
      };

      //save organization to database
      const newOrg = await organization.insert(body);

      if (org.logo) {
        // save logo image
        const newMedia = await media.insert(newOrg.id, 'logo', org.logo);

        //update organization, save to column image the newMedia.id
        const body = {
          name: newOrg.name,
          email: newOrg.email,
          image: newMedia.id,
        };
        await organization.update(newOrg.id, body);

        //console.log(`Organization Logo saved`);
      }

      return newOrg.id;
    } catch (err) {
      console.log('\x1b[31m%s\x1b[0m', err.message);
      return false;
    }
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
    const name = org.name;

    //check if org egsist in database by its name
    const orgInDatabase = await app.db.get(
      sql`SELECT id FROM organizations WHERE name = ${name} LIMIT 1`,
    );
    //console.log(`Organization from database: ${orgInDatabase.id}`);

    return orgInDatabase.id;
  } catch (err) {
    if (err.status !== 400)
      console.log('\x1b[31m%s\x1b[0m', err.status + ' ' + err.message);
    return false;
  }
}
