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
    sql`
    SELECT u.*, array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.id=${id}
    `,
  );
  return profile(user);
};

export const getProfileByUsername = async (username) => {
  const user = await app.db.get(
    sql`
    SELECT u.*, array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image    
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.username=${username}
    `,
  );
  return profile(user);
};
