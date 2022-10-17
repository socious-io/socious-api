import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

export const addLanguage = async (user, {name, level}) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO languages (name, level, user_id) 
    VALUES (${name}, ${level}, ${user.id})
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const editLanguage = async (id, user, {name, level}) => {
  try {
    const {rows} = await app.db.query(sql`
    UPDATE languages SET 
    name=${name},
    level=${level}
    WHERE user_id=${user.id} AND id=${id}
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const removeLanguage = async (id, user) => {
  await app.db.query(
    sql`DELETE FROM languages WHERE id=${id}, user_id=${user.id}`,
  );
};

export const addExperience = async (
  user,
  {org_id, title, description, skills, start_at, end_at},
) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO experiences (
      org_id,
      title,
      description,
      skills,
      start_at,
      end_at,
      user_id
    ) 
    VALUES (
      ${org_id},
      ${title},
      ${description},
      ${skills},
      ${start_at},
      ${end_at},
      ${user.id}
      )
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const editExperience = async (
  id,
  user,
  {org_id, title, description, skills, start_at, end_at},
) => {
  try {
    const {rows} = await app.db.query(sql`
    UPDATE experiences SET
      org_id=${org_id},
      title=${title},
      description=${description},
      skills=${skills},
      start_at=${start_at},
      end_at=${end_at}
    WHERE id=${id} AND user_id=${user.id}
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const removeExperience = async (id, user) => {
  await app.db.query(
    sql`DELETE FROM experiences WHERE id=${id}, user_id=${user.id}`,
  );
};
