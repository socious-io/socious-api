import sql from 'sql-template-tag';
import {app} from '../../index.js';

export const get = async (id) => {
  return app.db.get(sql`SELECT * FROM users WHERE id=${id}`);
};

export const getByUsername = async (username) => {
  return app.db.get(sql`SELECT * FROM users WHERE username=${username}`);
};

export const getByEmail = async (email) => {
  return app.db.get(sql`SELECT * FROM users WHERE email=${email}`);
};

export const getByPhone = async (phone) => {
  phone = phone.replace('+', '');
  return app.db.get(sql`SELECT * FROM users WHERE phone=${phone}`);
};

export const getOTP = async (code) => {
  return app.db.get(
    sql`SELECT * FROM otps WHERE code=${code} AND expired_at > now() AND verified_at IS NULL`,
  );
};

export const profile = async (id) => {
  const user = await get(id);
  delete user.password;
  return user;
};
