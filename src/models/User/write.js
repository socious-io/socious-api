import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {UserStatus} from './enum.js';

export const insert = async (username, email, hashedPasswd) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${hashedPasswd}) RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
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

export const createOTP = async (userId, otpType) => {
  // generate random 6 digit number
  const code = Math.floor(100000 + Math.random() * 900000);
  await app.db.query(
    sql`INSERT INTO otps (code, user_id, type) VALUES (${code}, ${userId}, ${otpType})`,
  );
  return code;
};
