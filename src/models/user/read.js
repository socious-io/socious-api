import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering, textSearch, sorting } from '../../utils/query.js'

export const filterColumns = {
  country: String,
  social_causes: Array,
  skills: Array
}

export const sortColumns = ['created_at', 'updated_at', 'impact_points']

/**
 * @param {string} id
 * @returns {Promise<import('../../../types/types').IUsersEntity>}
 */
export const get = async (id) => {
  return app.db.get(sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE id=${id}`)
}

/**
 * @param {string} username
 * @returns {Promise<import('../../../types/types').IUsersEntity>}
 */
export const getByUsername = async (username) => {
  return app.db.get(
    sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE username=${username.toLowerCase()}`
  )
}

/**
 * @param {string} email
 * @returns {Promise<import('../../../types/types').IUsersEntity>}
 */
export const getByEmail = async (email) => {
  return app.db.get(
    sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE email=${email.toLowerCase()}`
  )
}

/**
 * @param {string} phone
 * @returns {Promise<import('../../../types/types').IUsersEntity>}
 */
export const getByPhone = async (phone) => {
  return app.db.get(sql`SELECT *, array_to_json(social_causes) AS social_causes FROM users WHERE phone=${phone}`)
}
/**
 * @param {import('../../../types/types').IUsersEntity} user
 */
export const currentProfile = async (user) => {
  const { rows } = await app.db.query(sql`SELECT * FROM media WHERE id=ANY(${[user.avatar, user.cover_image]})`)
  delete user.password

  for (const row of rows) {
    if (row.id == user.avatar) user.avatar = row
    if (row.id == user.cover_image) user.cover_image = row
  }

  return user
}

export const getProfile = async (id, currentIdentity) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    city, country, geoname_id, mission, bio, impact_points,
    skills, followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image,
    COALESCE(r.id IS NOT NULL, false) AS reported,
    (SELECT
      jsonb_agg(json_build_object(
          'id', l.id,
          'name', l.name,
          'level', l.level
        ))
        FROM languages l
        WHERE user_id=u.id
    ) AS languages,
    (SELECT
      jsonb_agg(json_build_object(
          'id', e.id,
          'title', e.title,
          'description', e.description,
          'skills', e.skills,
          'start_at', e.start_at,
          'end_at', e.end_at,
          'org', row_to_json(org.*)
        ))
        FROM experiences e
        JOIN organizations org ON org.id=e.org_id
        WHERE user_id=u.id
    ) AS experiences
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    LEFT JOIN reports r ON r.user_id=u.id AND r.identity_id=${currentIdentity}
    WHERE u.id=${id} AND (r.blocked IS NULL OR r.blocked = false)
    `
  )
}

export const getProfileByUsername = async (username, currentIdentity) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    city, geoname_id, country, mission, bio, impact_points,
    skills, followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image,
    COALESCE(r.id IS NOT NULL, false) AS reported,
    (SELECT
      jsonb_agg(json_build_object(
          'id', l.id,
          'name', l.name,
          'level', l.level
        ))
        FROM languages l
        WHERE user_id=u.id
    ) AS languages,
    (SELECT
      jsonb_agg(json_build_object(
          'id', e.id,
          'title', e.title,
          'description', e.description,
          'skills', e.skills,
          'start_at', e.start_at,
          'end_at', e.end_at,
          'org', row_to_json(org.*)
        ))
        FROM experiences e
        JOIN organizations org ON org.id=e.org_id
        WHERE user_id=u.id
    ) AS experiences
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    LEFT JOIN reports r ON r.user_id=u.id AND r.identity_id=${currentIdentity}
    WHERE u.username=${username.toLowerCase()} AND (r.blocked IS NULL OR r.blocked = false)
    `
  )
}

export const getProfileLimited = async (id) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    mission, bio, impact_points, skills,
    followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.id=${id}
    `
  )
}

export const getAllProfile = async (ids, sort, currentIdentity) => {
  const { rows } = await app.db.query(
    sql`
    SELECT u.id, username, first_name, last_name,
    city, country, geoname_id, mission, bio, impact_points,
    skills, followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image,
    COALESCE(r.id IS NOT NULL, false) AS reported,
    (SELECT
      jsonb_agg(json_build_object(
          'id', l.id,
          'name', l.name,
          'level', l.level
        ))
        FROM languages l
        WHERE user_id=u.id
    ) AS languages,
    (SELECT
      jsonb_agg(json_build_object(
          'id', e.id,
          'title', e.title,
          'description', e.description,
          'skills', e.skills,
          'start_at', e.start_at,
          'end_at', e.end_at,
          'org', row_to_json(org.*)
        ))
        FROM experiences e
        JOIN organizations org ON org.id=e.org_id
        WHERE user_id=u.id
    ) AS experiences
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    LEFT JOIN reports r ON r.user_id=u.id AND r.identity_id=${currentIdentity}
    WHERE u.id=ANY(${ids}) AND (r.blocked IS NULL OR r.blocked = false)
    ${sorting(sort, sortColumns)}
    `
  )
  return rows
}

export const getProfileByUsernameLimited = async (username) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    mission, bio, impact_points, skills,
    followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    WHERE u.username=${username.toLowerCase()}
    `
  )
}

export const search = async (q, currentIdentity, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      u.id
    FROM users u
    WHERE
      u.id <> ${currentIdentity} AND
      u.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
  `)

  const users = await getAllProfile(rows.map((r) => r.id).slice(offset, offset + limit), sort, currentIdentity)

  return users.map((r) => {
    return {
      total_count: rows.length,
      ...r
    }
  })
}

export const searchRelateds = async (q, currentIdentity, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    WITH connected AS (
      SELECT * FROM connections WHERE
        (requester_id = ${currentIdentity} OR  requested_id = ${currentIdentity}) AND
        c.status <> 'BLOCKED'
    )
    SELECT
      u.id
    FROM users u
    WHERE
      (
        u.id IN (SELECT requester_id FROM connected) OR 
        u.id IN (SELECT requested_id FROM connected)
      ) AND
      u.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
  `)

  const users = await getAllProfile(rows.map((r) => r.id).slice(offset, offset + limit), sort)

  return users.map((r) => {
    return {
      total_count: rows.length,
      ...r
    }
  })
}

export const getRelateds = async (currentIdentity, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    WITH fl AS (
      SELECT * FROM follows WHERE follower_identity_id=${currentIdentity} OR following_identity_id=${currentIdentity}
    )
    SELECT
      u.id
    FROM users u
    WHERE
      (
        u.id IN (SELECT following_identity_id FROM fl) OR 
        u.id IN (SELECT follower_identity_id FROM fl)
      )
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
  `)

  const users = await getAllProfile(rows.map((r) => r.id).slice(offset, offset + limit), sort)

  return users.map((r) => {
    return {
      total_count: rows.length,
      ...r
    }
  })
}

export const getUsers = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      u.id
    FROM users u
      ${filtering(filter, filterColumns, false)}
    ${sorting(sort, sortColumns)}
  `)

  const users = await getAllProfile(rows.map((r) => r.id).slice(offset, offset + limit), sort, identityId)

  return users.map((r) => {
    return {
      total_count: rows.length,
      ...r
    }
  })
}

export const recommend = async (currentUser) => {
  const { rows } = await app.db.query(sql`
  SELECT u.id 
  FROM users u
  JOIN users current ON current.id=${currentUser}
  WHERE
    u.id NOT IN (SELECT following_identity_id FROM follows WHERE follower_identity_id=${currentUser}) AND
    u.country=COALESCE(current.country, u.country) AND
    u.social_causes @> COALESCE(current.social_causes, u.social_causes) AND
    u.skills @> COALESCE(current.skills, u.skills)
  ORDER BY random()
  LIMIT 10
  `)

  return getAllProfile(rows.map((r) => r.id))
}
