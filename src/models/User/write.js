import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

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

export const verifyOTP = async (id) => {
  await app.db.query(sql`UPDATE otps SET verified_at=now() WHERE id=${id}`);
};

export const createOTP = async (userId, retried = 0) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  try {
    await app.db.query(
      sql`INSERT INTO otps (code, user_id) VALUES (${code}, ${userId})`,
    );
  } catch (e) {
    retried++;
    console.log(`generated ${code} for OTP duplicated retried ${retried}`);
    if (retried > 5) throw e;
    createOTP(userId, retried);
  }
  return code;
};
