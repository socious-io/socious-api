import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {UserStatus} from './enum.js';

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
  return app.db.get(sql`SELECT * FROM users WHERE phone=${phone}`);
};

export const getOTP = async (user_id, code) => {
  const query = sql`
  SELECT otps.* FROM otps 
  INNER JOIN users ON users.id=otps.user_id 
  WHERE 
    otps.user_id=${user_id} AND
    otps.code=${code} AND otps.expired_at > now() AND 
    otps.verified_at IS NULL AND users.status != ${UserStatus.SUSPEND}
  `;
  return app.db.get(query);
};

export const profile = async (user) => {
  delete user.password;
  return user;
};

export const getProfile = async (id) => {
  const user = await get(id);
  return profile(user);
};
