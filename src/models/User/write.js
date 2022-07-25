import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {OTPPurposeType, UserStatus} from './enum.js';
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
    INSERT INTO users (first_name, last_name, username, email, password) VALUES (${first_name}, ${last_name}, ${username}, ${email}, ${hashedPasswd}) RETURNING *
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
      bio=${profile.bio ?? null}, city=${profile.city ?? null}, address=${
    profile.address ?? null
  }, wallet_address=${profile.wallet_address ?? null}
    WHERE id=${id} RETURNING *
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
    sql`UPDATE users SET email_verified_at=now(),status=${UserStatus.ACTIVE} WHERE id=${id}`,
  );
};

export const verifyPhone = async (id) => {
  await app.db.query(
    sql`UPDATE users SET phone_verified_at=now(),status=${UserStatus.ACTIVE} WHERE id=${id}`,
  );
};

export const verifyOTP = async (id) => {
  await app.db.query(sql`UPDATE otps SET verified_at=now() WHERE id=${id}`);
};

export const createOTP = async (
  userId,
  otpType,
  otpPurpose = OTPPurposeType.AUTH,
) => {
  // generate random 6 digit number
  const code = Math.floor(100000 + Math.random() * 900000);
  await app.db.query(
    sql`INSERT INTO otps (code, user_id, type, purpose) VALUES (${code}, ${userId}, ${otpType}, ${otpPurpose})`,
  );
  console.log(`OTP Code generated for ${userId} => ${code}`);
  return code;
};
