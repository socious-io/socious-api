import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {StatusType} from './enums.js';
import {updateProfileSchem} from './schema.js';

export const insert = async (
  first_name,
  last_name,
  username,
  email,
  hashedPasswd,
) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO users (first_name, last_name, username, email, password) VALUES (${first_name}, ${last_name}, ${username}, ${email.toLowerCase()}, ${hashedPasswd}) RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const updateProfile = async (id, profile) => {
  await updateProfileSchem.validateAsync(profile);
  const query = sql`
    UPDATE users SET 
      first_name=${profile.first_name}, last_name=${profile.last_name},
      avatar=${profile.avatar}, cover_image=${profile.cover_image},
      bio=${profile.bio}, city=${profile.city}, address=${profile.address}, 
      wallet_address=${profile.wallet_address}, social_causes=${profile.social_causes},
      skills=${profile.skills}
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
