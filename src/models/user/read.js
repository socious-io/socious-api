import sql from 'sql-template-tag';
import {app} from '../../index.js';

export const get = async (id) => {
  return app.db.get(
    sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE id=${id}`,
  );
};

export const getByUsername = async (username) => {
  return app.db.get(
    sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE username=${username}`,
  );
};

export const getByEmail = async (email) => {
  return app.db.get(
    sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE email=${email.toLowerCase()}`,
  );
};

export const getByPhone = async (phone) => {
  return app.db.get(
    sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE phone=${phone}`,
  );
};

export const profile = async (user) => {
  delete user.password;
  return user;
};

export const getProfile = async (id) => {
  const user = await app.db.get(
    sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE id=${id}`,
  );
  const {rows} = await app.db.query(
    sql`SELECT * FROM media WHERE id IN (${user.avatar}, ${user.cover_image})`,
  );
  for (const media of rows) {
    if (media.id === user.avatar) user.avatar = media;
    if (media.id === user.cover_image) user.cover_image = media;
  }
  return profile(user);
};
