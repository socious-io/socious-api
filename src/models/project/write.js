import Joi from 'joi';
import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {upsertSchem} from './schema.js';

export const insert = async (identityId, body) => {
  await Joi.string().uuid().validateAsync(identityId);
  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO projects (
        title, description, identity_id, 
        payment_type, payment_scheme, payment_currency, 
        payment_range_lower, payment_range_higher, experience_level,
        status, remote_preference, project_type, project_length,
        skills, causes_tags, country
      )
      VALUES (
        ${body.title}, ${body.description}, ${identityId}, 
        ${body.payment_type}, ${body.payment_scheme}, 
        ${body.payment_currency}, ${body.payment_range_lower},
        ${body.payment_range_higher}, ${body.experience_level}, ${body.status},
        ${body.remote_preference}, ${body.project_type}, ${body.project_length},
        ${body.skills}, ${body.causes_tags}, ${body.country}
      )
      RETURNING *, array_to_json(causes_tags) AS causes_tags`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (id, body) => {
  await Joi.string().uuid().validateAsync(id);
  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE projects SET
        title=${body.title},
        description=${body.description},
        payment_type=${body.payment_type},
        payment_scheme=${body.payment_scheme},
        payment_currency=${body.payment_currency},
        payment_range_lower=${body.payment_range_lower},
        payment_range_higher=${body.payment_range_higher},
        experience_level=${body.experience_level},
        remote_preference=${body.remote_preference},
        status=${body.status},
        project_type=${body.project_type}, 
        project_length=${body.project_length},
        skills=${body.skills},
        causes_tags=${body.causes_tags},
        country=${body.country}
      WHERE id=${id} RETURNING *, array_to_json(causes_tags) AS causes_tags`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  await Joi.string().uuid().validateAsync(id);
  await app.db.query(sql`DELETE FROM projects WHERE id=${id}`);
};
