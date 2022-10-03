import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {StatusType} from './enums.js';

export const insert = async (
  first_name,
  last_name,
  username,
  email,
  hashedPasswd,
) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO users (first_name, last_name, username, email, password) 
    VALUES (${first_name}, ${last_name}, ${username.toLowerCase()},
      ${email.toLowerCase()}, ${hashedPasswd}) RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const updateProfile = async (
  id,
  {
    first_name,
    last_name,
    avatar,
    cover_image,
    phone,
    bio,
    city,
    address,
    country,
    wallet_address,
    social_causes,
    skills,
    mission,
    language,
    mobile_country_code,
    username,
  },
) => {
  const query = sql`
    UPDATE users SET 
      first_name=${first_name}, last_name=${last_name},
      avatar=${avatar}, cover_image=${cover_image}, phone=${phone},
      bio=${bio}, city=${city}, address=${address}, country=${country},
      wallet_address=${wallet_address}, social_causes=${social_causes},
      skills=${skills}, mission=${mission}, language=${language},
      mobile_country_code=${mobile_country_code},username=${username.toLowerCase()}
    WHERE id=${id} RETURNING *, array_to_json(social_causes) AS social_causes
  `;
  try {
    const {rows} = await app.db.query(query);
    const user = rows[0];
    delete user.password;
    return user;
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const updatePassword = async (id, newPassword) => {
  await app.db.query(
    sql`UPDATE users SET password=${newPassword}, password_expired=false WHERE id=${id}`,
  );
};

export const expirePassword = async (id) => {
  await app.db.query(
    sql`UPDATE users SET password_expired=true WHERE id=${id}`,
  );
};

export const verifyEmail = async (id) => {
  await app.db.query(
    sql`UPDATE users SET email_verified_at=now(),status=${StatusType.ACTIVE} WHERE id=${id}`,
  );
};

export const verifyPhone = async (id) => {
  await app.db.query(
    sql`UPDATE users SET phone_verified_at=now(),status=${StatusType.ACTIVE} WHERE id=${id}`,
  );
};
