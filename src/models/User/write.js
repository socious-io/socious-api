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


/*
  As we generate 6 digit number as OTP code and in OTP table code constraint to be unique
  there is no garanty everytime we generate this would be unique
  this retry make sure we don't get any problem to saving otps record
  still has very very tiny chance to make 5 time exists code on long term
  TODO plan would be create a PSQL function to clean otps table old codes
  and schdule to run these cleaner daily bases.
*/
export const createOTP = async (userId, retried = 0) => {
  // generate random 6 digit number
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
