import sql from 'sql-template-tag';
import {app} from '../../index.js';

export const insert = async (
  id,
  options,
  info,
  to,
  subject,
  body,
  body_type,
  service,
  date,
) => {
  await app.db.query(
    sql`INSERT INTO emails
      (id, options, info, "to", subject, body, body_type, service, created_at)
      VALUES (
        ${id}::uuid, ${options}, ${info},
        ${to}, ${subject}, ${body}, ${body_type},
        ${service}::email_service_type, ${date})`,
  );
};
