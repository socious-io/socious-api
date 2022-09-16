import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {shortNameExists} from './read.js';

const generateShortname = (name, website) => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  if (website)
    return `${website
      .split(/([^.]+)\.[^.]+$/)[1]
      .replace(/@.*$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9._-]/, '-')
      .replace(/[._-]{2,}/, '-')
      .slice(0, 36)}${rand}`;
  return `${name.replaceAll(' ', '_').slice(0, 36)}${rand}`;
};

export const insert = async (
  identityId,
  {
    shortname,
    name,
    website,
    bio,
    description,
    email,
    phone,
    type,
    city,
    address,
    country,
    social_causes,
    mobile_country_code,
    mission,
    culture,
    image,
    cover_image,
  },
) => {
  // temp logic
  if (!shortname) {
    shortname = generateShortname(name, website);
    if (await shortNameExists(shortname))
      return insert(identityId, {
        shortname,
        name,
        website,
        bio,
        description,
        email,
        phone,
        type,
        city,
        address,
        country,
        social_causes,
        mobile_country_code,
        mission,
        culture,
        image,
        cover_image,
      });
  }

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO organizations (
        name, bio, description, email, phone, 
        type, city, address, country, website, 
        social_causes, mobile_country_code, created_by, image, cover_image,
        mission, culture) 
        VALUES (${name}, ${bio}, ${description}, ${email},
          ${phone}, ${type} ,${city}, ${address}, ${country},
          ${website}, ${social_causes}, ${mobile_country_code},
          ${identityId}, ${image}, ${cover_image}, ${mission}, ${culture})
        RETURNING *, array_to_json(social_causes) AS social_causes`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (
  id,
  {
    shortname,
    name,
    website,
    bio,
    description,
    email,
    phone,
    type,
    city,
    address,
    country,
    social_causes,
    mobile_country_code,
    mission,
    culture,
    image,
    cover_image,
  },
) => {
  // temp logic
  if (!shortname) {
    shortname = generateShortname(name, website);
    if (await shortNameExists(shortname))
      return update(id, {
        shortname,
        name,
        website,
        bio,
        description,
        email,
        phone,
        type,
        city,
        address,
        country,
        social_causes,
        mobile_country_code,
        mission,
        culture,
        image,
        cover_image,
      });
  }

  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE organizations SET 
        name=${name}, 
        bio=${bio}, 
        description=${description}, 
        email=${email}, 
        phone=${phone}, 
        city=${city}, 
        address=${address}, 
        website=${website},
        social_causes=${social_causes},
        country=${country},
        mobile_country_code=${mobile_country_code},
        image=${image},
        cover_image=${cover_image},
        mission=${mission},
        culture=${culture}
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
