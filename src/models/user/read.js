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

export const currentProfile = async (user) => {
  const {rows} = await app.db.query(
    sql`SELECT * FROM media WHERE id=ANY(${[user.avatar, user.cover_image]})`,
  );
  delete user.password;

  for (const row of rows) {
    if (row.id == user.avatar) user.avatar = row;
    if (row.id == user.cover_image) user.cover_image = row;
  }

  return user;
};

export const getProfile = async (id) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    city, country, mission, bio, impact_score, skills,
    followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.id=${id}
    `,
  );
};

export const getProfileByUsername = async (username) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    city, country, mission, bio, impact_score, skills,
    followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.username=${username}
    `,
  );
};

export const getProfileLimited = async (id) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    mission, bio, impact_score, skills,
    followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.id=${id}
    `,
  );
};

export const getAllProfile = async (ids) => {
  const {rows} = app.db.query(
    sql`
    SELECT u.id, username, first_name, last_name,
    mission, bio, impact_score, skills,
    followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.id=ANY(${ids})
    `,
  );
  return rows;
};

export const getProfileByUsernameLimited = async (username) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    mission, bio, impact_score, skills,
    followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.username=${username}
    `,
  );
};

export const filterColumns = ['country', 'social_causes', 'skills'];
