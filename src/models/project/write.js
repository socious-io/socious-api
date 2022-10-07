import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

export const insert = async (
  identityId,
  {
    title,
    description,
    payment_type,
    payment_scheme,
    payment_currency,
    payment_range_lower,
    payment_range_higher,
    experience_level,
    status,
    remote_preference,
    project_type,
    project_length,
    skills,
    causes_tags,
    country,
    city,
    weekly_hours_lower,
    weekly_hours_higher,
    commitment_hours_lower,
    commitment_hours_higher,
  },
) => {
  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO projects (
        title, description, identity_id, 
        payment_type, payment_scheme, payment_currency, 
        payment_range_lower, payment_range_higher, experience_level,
        status, remote_preference, project_type, project_length,
        skills, causes_tags, country, city,
        weekly_hours_lower,
        weekly_hours_higher,
        commitment_hours_lower,
        commitment_hours_higher
      )
      VALUES (
        ${title}, ${description}, ${identityId}, 
        ${payment_type}, ${payment_scheme}, 
        ${payment_currency}, ${payment_range_lower},
        ${payment_range_higher}, ${experience_level}, ${status},
        ${remote_preference}, ${project_type}, ${project_length},
        ${skills}, ${causes_tags}, ${country}, ${city},
        ${weekly_hours_lower}, ${weekly_hours_higher}, ${commitment_hours_lower},
        ${commitment_hours_higher}
      )
      RETURNING *, array_to_json(causes_tags) AS causes_tags`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (
  id,
  {
    title,
    description,
    payment_type,
    payment_scheme,
    payment_currency,
    payment_range_lower,
    payment_range_higher,
    experience_level,
    status,
    remote_preference,
    project_type,
    project_length,
    skills,
    causes_tags,
    country,
    city,
    weekly_hours_lower,
    weekly_hours_higher,
    commitment_hours_lower,
    commitment_hours_higher,
  },
) => {
  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE projects SET
        title=${title},
        description=${description},
        payment_type=${payment_type},
        payment_scheme=${payment_scheme},
        payment_currency=${payment_currency},
        payment_range_lower=${payment_range_lower},
        payment_range_higher=${payment_range_higher},
        experience_level=${experience_level},
        remote_preference=${remote_preference},
        status=${status},
        project_type=${project_type}, 
        project_length=${project_length},
        skills=${skills},
        causes_tags=${causes_tags},
        country=${country},
        city=${city}
        weekly_hours_lower=${weekly_hours_lower},
        weekly_hours_higher=${weekly_hours_higher},
        commitment_hours_lower=${commitment_hours_lower},
        commitment_hours_higher=${commitment_hours_higher}
      WHERE id=${id} RETURNING *, array_to_json(causes_tags) AS causes_tags`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  await app.db.query(sql`DELETE FROM projects WHERE id=${id}`);
};
