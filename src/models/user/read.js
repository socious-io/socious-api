import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering, textSearch, sorting } from '../../utils/query.js'

export const filterColumns = {
  country: String,
  city: String,
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
    skills, followers, followings, u.created_at, wallet_address,
    proofspace_connect_id,
    phone, address,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image,
    COALESCE(r.id IS NOT NULL, false) AS reported,
    mobile_country_code,
    open_to_work,
    open_to_volunteer,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='EDUCATION'
    ) AS educations,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='PORTFOLIO'
    ) AS portfolios,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='CERTIFICATE'
    ) AS certificates,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='RECOMMENDATIONS'
    ) AS recommendations,
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
          'org', row_to_json(org.*),
          'job_category', row_to_json(j.*),
          'country', e.country,
          'city', e.city,
          'employment_type', e.employment_type
        ))
        FROM experiences e
        JOIN organizations org ON org.id=e.org_id
        LEFT JOIN job_categories j ON j.id=e.job_category_id
        WHERE user_id=u.id
    ) AS experiences
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    LEFT JOIN reports r ON r.user_id=u.id AND r.identity_id=${currentIdentity}
    WHERE u.id=${id}
    `
  )
}

export const getProfileByUsername = async (username, currentIdentity) => {
  return app.db.get(
    sql`
    SELECT u.id, username, first_name, last_name,
    city, geoname_id, country, mission, bio, impact_points,
    skills, followers, followings, u.created_at, wallet_address,
    proofspace_connect_id,
    phone, address,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image,
    COALESCE(r.id IS NOT NULL, false) AS reported,
    mobile_country_code,
    open_to_work,
    open_to_volunteer,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='EDUCATION'
    ) AS educations,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='PORTFOLIO'
    ) AS portfolios,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='CERTIFICATE'
    ) AS certificates,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='RECOMMENDATIONS'
    ) AS recommendations,
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
          'org', row_to_json(org.*),
          'job_category', row_to_json(j.*),
          'country', e.country,
          'city', e.city,
          'employment_type', e.employment_type
        ))
        FROM experiences e
        JOIN organizations org ON org.id=e.org_id
        LEFT JOIN job_categories j ON j.id=e.job_category_id
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
    open_to_work,
    open_to_volunteer,
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
    open_to_work,
    open_to_volunteer,
    skills, followers, followings, u.created_at, wallet_address,
    array_to_json(u.social_causes) AS social_causes,
    proofspace_connect_id,
    phone, address,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image,
    COALESCE(r.id IS NOT NULL, false) AS reported,
    mobile_country_code,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='EDUCATION'
    ) AS educations,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='PORTFOLIO'
    ) AS portfolios,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='CERTIFICATE'
    ) AS certificates,
    (SELECT
      jsonb_agg(json_build_object(
          'id', adds.id,
          'type', adds.type,
          'title', adds.title,
          'image', row_to_json(img.*),
          'sub_image', row_to_json(sub_img.*),
          'description', adds.description,
          'meta', adds.meta,
          'url', adds.meta,
          'enabled', adds.enabled,
          'created_at', adds.created_at
        ))
        FROM additionals adds
        LEFT JOIN media img ON img.id=adds.image
        LEFT JOIN media sub_img ON sub_img.id=adds.sub_image
        WHERE adds.identity_id=u.id and type='RECOMMENDATIONS'
    ) AS recommendations,
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
          'org', row_to_json(org.*),
          'job_category', row_to_json(j.*),
          'country', e.country,
          'city', e.city,
          'employment_type', e.employment_type,
          LEFT JOIN job_categories j ON j.id=e.job_category_id
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
    open_to_work,
    open_to_volunteer,
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
      COUNT(*) OVER () as total_count,
      u.id
    FROM users u
    WHERE
      u.id <> ${currentIdentity} AND
      u.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
  `)

  const users = await getAllProfile(
    rows.map((r) => r.id),
    sort,
    currentIdentity
  )

  return users.map((r) => {
    return {
      total_count: rows.length > 0 ? rows[0].total_count : 0,
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
      COUNT(*) OVER () as total_count,
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
    LIMIT ${limit} OFFSET ${offset}
  `)

  const users = await getAllProfile(
    rows.map((r) => r.id),
    sort
  )

  return users.map((r) => {
    return {
      total_count: rows.length > 0 ? rows[0].total_count : 0,
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
      COUNT(*) OVER () as total_count,
      u.id
    FROM users u
    WHERE
      (
        u.id IN (SELECT following_identity_id FROM fl) OR 
        u.id IN (SELECT follower_identity_id FROM fl)
      )
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
  `)

  const users = await getAllProfile(
    rows.map((r) => r.id),
    sort
  )

  return users.map((r) => {
    return {
      total_count: rows.length > 0 ? rows[0].total_count : 0,
      ...r
    }
  })
}

export const getUsers = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(sql`
    SELECT
      COUNT(*) OVER () as total_count,
      u.id
    FROM users u
      ${filtering(filter, filterColumns, false)}
    ${sorting(sort, sortColumns)}
    LIMIT ${limit} OFFSET ${offset}
  `)

  const users = await getAllProfile(
    rows.map((r) => r.id),
    sort,
    identityId
  )

  return users.map((r) => {
    return {
      total_count: rows.length > 0 ? rows[0].total_count : 0,
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
