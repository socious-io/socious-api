import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {upsertSchem} from './schema.js';
import {shortNameExists} from './read.js';

const generateShortname = (name, website) => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  if (website)
    return `${website
      .replace(/@.*$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9._-]/, '-')
      .replace(/[._-]{2,}/, '-')
      .slice(0, 36)}${rand}`;
  return `${name.replaceAll(' ', '_').slice(0, 36)}${rand}`;
};

export const insert = async (identityId, body) => {
  // temp logic
  if (!body.shortname) {
    const shortname = generateShortname(body.name, body.website);
    if (await shortNameExists(shortname)) return insert(identityId, body);
    body.shortname = shortname;
  }
  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO organizations (
        name, bio, description, email, phone, 
        type, city, address, country, website, 
        social_causes, mobile_country_code, created_by, image, cover_image,
        mission, culture) 
        VALUES (${body.name}, ${body.bio}, ${body.description}, ${body.email},
          ${body.phone}, ${body.type} ,${body.city}, ${body.address}, ${body.country},
          ${body.website}, ${body.social_causes}, ${body.mobile_country_code},
          ${identityId}, ${body.image}, ${body.cover_image}, ${body.mission}, ${body.culture})
        RETURNING *, array_to_json(social_causes) AS social_causes`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (id, body) => {
  // temp logic
  if (!body.shortname) {
    const shortname = generateShortname(body.name, body.website);
    if (await shortNameExists(shortname)) return update(id, body);
    body.shortname = shortname;
  }

  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE organizations SET 
        name=${body.name}, 
        bio=${body.bio}, 
        description=${body.description}, 
        email=${body.email}, 
        phone=${body.phone}, 
        city=${body.city}, 
        address=${body.address}, 
        website=${body.website},
        social_causes=${body.social_causes},
        country=${body.country},
        mobile_country_code=${body.mobile_country_code},
        image=${body.image},
        cover_image=${body.cover_image},
        mission=${body.mission},
        culture=${body.culture}
      WHERE id=${id} RETURNING *, array_to_json(social_causes) AS social_causes`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  await app.db.query(sql`DELETE FROM organizations WHERE id=${id}`);
};
