import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {upsertSchem} from './schema.js';

export const insert = async (identityId, body) => {
  await upsertSchem.validateAsync(body);
  
  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO applicants (project_id, user_id, identity_id, cover_letter, attachment_name, attachment_link, application_status, payment_type, payment_rate, offer_rate, offer_message) 
        VALUES (${body.project_id}, ${body.user_id}, ${identityId}, ${body.cover_letter}, ${body.attachment_name}, ${body.attachment_link}, ${body.application_status}, ${body.payment_type}, ${body.payment_rate}, ${body.offer_rate}, ${body.offer_message})
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
      UPDATE applicants SET
        project_id=${body.project_id},
        user_id=${body.user_id},
        cover_letter=${body.cover_letter},
        attachment_name=${body.attachment_name},
        attachment_link=${body.attachment_link},
        application_status=${body.application_status},
        payment_type=${body.payment_type},
        payment_rate=${body.payment_rate},
        offer_rate=${body.offer_rate},
        offer_message=${body.offer_message}
      WHERE id=${id} RETURNING *`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  await app.db.query(sql`DELETE FROM applicants WHERE id=${id}`);
};
