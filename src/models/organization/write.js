import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {upsertSchem} from './schema.js';

export const insert = async (body) => {
  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO organizations (name, bio, description, email, phone, type, city, address, country, website, social_causes, mobile_country_code, image) 
        VALUES (${body.name}, ${body.bio}, ${body.description}, ${body.email},
          ${body.phone}, ${body.type} ,${body.city}, ${body.address}, ${body.country},
          ${body.website}, ${body.social_causes}, ${body.mobile_country_code}, ${body.image})
        RETURNING *, array_to_json(social_causes) AS social_causes`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (id, body) => {
  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE organizations SET 
        name=${body.name}, bio=${body.bio}, description=${body.description}, email=${body.email}, 
        phone=${body.phone}, city=${body.city}, address=${body.address}, website=${body.website},
        social_causes=${body.social_causes},
        mobile_country_code=${body.mobile_country_code},
        image=${body.image}
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
