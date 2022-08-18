import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {upsertSchem} from './schema.js';

export const insert = async (identityId, body) => {
  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO projects (
        title, description, identity_id, country_id, 
        payment_type, payment_scheme, payment_currency, 
        payment_range_lower, payment_range_higher, experience_level,
        status, remote_preference
      )
      VALUES (
        ${body.title}, ${body.description}, ${identityId}, 
        ${body.country_id}, ${body.payment_type}, ${body.payment_scheme}, 
        ${body.payment_currency}, ${body.payment_range_lower},
        ${body.payment_range_higher}, ${body.experience_level}, ${body.status},
        ${body.remote_preference}
      )
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
      UPDATE projects SET
        title=${body.title},
        description=${body.description},
        country_id=${body.country_id},
        payment_type=${body.payment_type},
        payment_scheme=${body.payment_scheme},
        payment_currency=${body.payment_currency},
        payment_range_lower=${body.payment_range_lower},
        payment_range_higher=${body.payment_range_higher},
        experience_level=${body.experience_level},
        remote_preference=${body.remote_preference},
        status=${body.status}
      WHERE id=${id} RETURNING *`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  await app.db.query(sql`DELETE FROM projects WHERE id=${id}`);
};
