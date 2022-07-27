import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {upsertSchem} from './schema.js';



export const insert = async (body) => {
  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO organization (name, bio, description, email, phone, type, city, address, website) 
        VALUES (${body.name}, ${body.bio}, ${body.description}, ${body.email}, 
          ${body.phone}, ${body.type} ,${body.city}, ${body.address}, ${body.website})
        RETURNING *`,
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
      UPDATE organization SET 
        name=${body.name}, bio=${body.bio}, description=${body.description}, email=${body.email}, 
        phone=${body.phone}, city=${body.city}, address=${body.address}, website=${body.website}
      WHERE id=${id} RETURNING *`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};


export const remove = async (id) => {
  await app.db.query(sql`DELETE FROM organization WHERE id=${id}`)
};
