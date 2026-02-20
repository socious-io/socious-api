import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering, textSearch, sorting } from '../../utils/query.js'

export const filterColumns = {
  country: String,
  city: String,
  social_causes: Array,
  skills: Array,
  events: Array
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
    (CASE WHEN er.id IS NOT NULL THEN true ELSE false END) AS following,
    (CASE WHEN ing.id IS NOT NULL THEN true ELSE false END) AS follower,
    (c.status) AS connection_status,
    (c.id) AS connection_id,
    mobile_country_code,
    open_to_work,
    open_to_volunteer,
    is_contributor,
    identity_verified,
    (SELECT
      jsonb_agg(json_build_object(
          'id', id,
          'title', title,
          'description', description,
          'event_at', event_at,
          'created_at', created_at
        ))
     FROM socious_events
     WHERE id=ANY(u.events)
    ) AS events,
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
    jsonb_agg(
        json_build_object(
          'id', oe.id,
          'title', oe.title,
          'description', oe.description,
          'skills', oe.skills,
          'start_at', oe.start_at,
          'end_at', oe.end_at,
          'org', json_build_object(
              'id', oe.org_id,
              'name', oe.org_name,
              'bio', oe.org_bio,
              'shortname', oe.org_shortname,
              'city', oe.org_city,
              'country', oe.org_country,
              'created_at', oe.org_created_at,
              'updated_at', oe.org_updated_at,
              'description', oe.org_description,
              'image', json_build_object(
                'id', oe.org_media_id,
                'url', oe.org_media_url -- Example media fields
              )
          ),
          'job_category', json_build_object(
              'id', oe.job_category_id,
              'name', oe.job_category_name -- Example job category fields
          ),
          'country', oe.country,
          'city', oe.city,
          'employment_type', oe.employment_type,
          'credential', CASE WHEN oe.ec_id IS NULL THEN NULL
              ELSE json_build_object(
                'id', oe.ec_id,
                'status', oe.ec_status,
                'message', oe.ec_message,
                'connection_id', oe.ec_connection_id,
                'connection_url', oe.ec_connection_url,
                'created_at', oe.ec_created_at,
                'updated_at', oe.ec_updated_at
              )
          END
        )
    )
    FROM (
        SELECT 
          e.id, e.title, e.description, e.skills, e.start_at, e.end_at, 
          e.country, e.city, e.employment_type,
          org.id AS org_id, org.name AS org_name, org.bio AS org_bio, 
          org.shortname AS org_shortname, org.city AS org_city, org.country AS org_country, 
          org.created_at AS org_created_at, org.updated_at AS org_updated_at, org.description AS org_description,
          org_media.id AS org_media_id, org_media.url AS org_media_url, -- Explicit media fields
          j.id AS job_category_id, j.name AS job_category_name, -- Explicit job category fields
          ec.id AS ec_id, ec.status AS ec_status, ec.message AS ec_message, 
          ec.connection_id AS ec_connection_id, ec.connection_url AS ec_connection_url, 
          ec.created_at AS ec_created_at, ec.updated_at AS ec_updated_at
        FROM experiences e
        JOIN organizations org ON org.id = e.org_id
        LEFT JOIN media org_media ON org_media.id = org.image
        LEFT JOIN job_categories j ON j.id = e.job_category_id
        LEFT JOIN experience_credentials ec ON ec.experience_id = e.id
        WHERE e.user_id = u.id 
          AND (ec.status IS NULL OR ec.status != 'ISSUED')
        ORDER BY e.start_at DESC
    ) AS oe
  ) AS experiences
    ,
    (SELECT
      jsonb_agg(json_build_object(
          'id', e.id,
          'title', e.title,
          'degree', e.degree,
          'grade', e.grade,
          'description', e.description,
          'start_at', e.start_at,
          'end_at', e.end_at,
          'org', json_build_object(
            'id', org.id,
            'name', org.name,
            'bio', org.bio,
            'shortname', org.shortname,
            'city', org.city,
            'country', org.country,
            'created_at', org.created_at,
            'updated_at', org.created_at,
            'description', org.description,
            'image', row_to_json(org_media.*)
          ),
          'credential', CASE WHEN ec.id IS NULL THEN NULL
          ELSE json_build_object(
            'id', ec.id,
            'status', ec.status,
            'message', ec.message,
            'connection_id', ec.connection_id,
            'connection_url', ec.connection_url,
            'created_at', ec.created_at,
            'updated_at', ec.updated_at
          )
          END
        ))
        FROM educations e
        JOIN organizations org ON org.id=e.org_id
        LEFT JOIN media org_media ON org_media.id=org.image
        LEFT JOIN educations_credentials ec ON ec.education_id=e.id
        WHERE e.user_id=u.id AND (ec.status IS NULL OR ec.status != 'ISSUED')
    ) AS educations,
    (
	    SELECT COUNT(*)::int
	    FROM connections c2
	    WHERE (c2.requested_id=u.id OR c2.requester_id=u.id) AND c2.status='CONNECTED'
    ) AS connections,
    (SELECT array_agg(row_to_json(w.*)) FROM wallets w WHERE w.user_id=u.id) AS wallets
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    LEFT JOIN follows er ON er.follower_identity_id=${currentIdentity} AND er.following_identity_id=u.id
    LEFT JOIN follows ing ON ing.following_identity_id=${currentIdentity} AND ing.follower_identity_id=u.id
    LEFT JOIN reports r ON r.user_id=u.id AND r.identity_id=${currentIdentity}
    LEFT JOIN connections c ON 
      (c.requested_id=u.id AND c.requester_id=${currentIdentity}) OR
      (c.requested_id=${currentIdentity} AND c.requester_id=u.id)
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
    (CASE WHEN er.id IS NOT NULL THEN true ELSE false END) AS following,
    (CASE WHEN ing.id IS NOT NULL THEN true ELSE false END) AS follower,
    (c.status) AS connection_status,
    (c.id) AS connection_id,
    mobile_country_code,
    open_to_work,
    open_to_volunteer,
    identity_verified,
    is_contributor,
    (SELECT
      jsonb_agg(json_build_object(
          'id', id,
          'title', title,
          'description', description,
          'event_at', event_at,
          'created_at', created_at
        ))
        FROM socious_events
        WHERE id=ANY(u.events)
    ) AS events,
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
    jsonb_agg(
        json_build_object(
          'id', oe.id,
          'title', oe.title,
          'description', oe.description,
          'skills', oe.skills,
          'start_at', oe.start_at,
          'end_at', oe.end_at,
          'org', json_build_object(
              'id', oe.org_id,
              'name', oe.org_name,
              'bio', oe.org_bio,
              'shortname', oe.org_shortname,
              'city', oe.org_city,
              'country', oe.org_country,
              'created_at', oe.org_created_at,
              'updated_at', oe.org_updated_at,
              'description', oe.org_description,
              'image', json_build_object(
                'id', oe.org_media_id,
                'url', oe.org_media_url -- Example media fields
              )
          ),
          'job_category', json_build_object(
              'id', oe.job_category_id,
              'name', oe.job_category_name -- Example job category fields
          ),
          'country', oe.country,
          'city', oe.city,
          'employment_type', oe.employment_type,
          'credential', CASE WHEN oe.ec_id IS NULL THEN NULL
              ELSE json_build_object(
                'id', oe.ec_id,
                'status', oe.ec_status,
                'message', oe.ec_message,
                'connection_id', oe.ec_connection_id,
                'connection_url', oe.ec_connection_url,
                'created_at', oe.ec_created_at,
                'updated_at', oe.ec_updated_at
              )
          END
        )
    )
    FROM (
        SELECT 
          e.id, e.title, e.description, e.skills, e.start_at, e.end_at, 
          e.country, e.city, e.employment_type,
          org.id AS org_id, org.name AS org_name, org.bio AS org_bio, 
          org.shortname AS org_shortname, org.city AS org_city, org.country AS org_country, 
          org.created_at AS org_created_at, org.updated_at AS org_updated_at, org.description AS org_description,
          org_media.id AS org_media_id, org_media.url AS org_media_url, -- Explicit media fields
          j.id AS job_category_id, j.name AS job_category_name, -- Explicit job category fields
          ec.id AS ec_id, ec.status AS ec_status, ec.message AS ec_message, 
          ec.connection_id AS ec_connection_id, ec.connection_url AS ec_connection_url, 
          ec.created_at AS ec_created_at, ec.updated_at AS ec_updated_at
        FROM experiences e
        JOIN organizations org ON org.id = e.org_id
        LEFT JOIN media org_media ON org_media.id = org.image
        LEFT JOIN job_categories j ON j.id = e.job_category_id
        LEFT JOIN experience_credentials ec ON ec.experience_id = e.id
        WHERE e.user_id = u.id 
          AND (ec.status IS NULL OR ec.status != 'ISSUED')
        ORDER BY e.start_at DESC
    ) AS oe
  ) AS experiences
     ,
    (SELECT
      jsonb_agg(json_build_object(
          'id', e.id,
          'title', e.title,
          'degree', e.degree,
          'grade', e.grade,
          'description', e.description,
          'start_at', e.start_at,
          'end_at', e.end_at,
          'org', json_build_object(
            'id', org.id,
            'name', org.name,
            'bio', org.bio,
            'shortname', org.shortname,
            'city', org.city,
            'country', org.country,
            'created_at', org.created_at,
            'updated_at', org.created_at,
            'description', org.description,
            'image', row_to_json(org_media.*)
          ),
          'credential', CASE WHEN ec.id IS NULL THEN NULL
          ELSE json_build_object(
            'id', ec.id,
            'status', ec.status,
            'message', ec.message,
            'connection_id', ec.connection_id,
            'connection_url', ec.connection_url,
            'created_at', ec.created_at,
            'updated_at', ec.updated_at
          )
          END
        ))
        FROM educations e
        JOIN organizations org ON org.id=e.org_id
        LEFT JOIN media org_media ON org_media.id=org.image
        LEFT JOIN educations_credentials ec ON ec.education_id=e.id
        WHERE e.user_id=u.id AND (ec.status IS NULL OR ec.status != 'ISSUED')
    ) AS educations,
    (
	    SELECT COUNT(*)::int
	    FROM connections c2
	    WHERE (c2.requested_id=u.id OR c2.requester_id=u.id) AND c2.status='CONNECTED'
    ) AS connections,
     (SELECT array_agg(row_to_json(w.*)) FROM wallets w WHERE w.user_id=u.id) AS wallets
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    LEFT JOIN reports r ON r.user_id=u.id AND r.identity_id=${currentIdentity}
    LEFT JOIN follows er ON er.follower_identity_id=${currentIdentity} AND er.following_identity_id=u.id
    LEFT JOIN follows ing ON ing.following_identity_id=${currentIdentity} AND ing.follower_identity_id=u.id
    LEFT JOIN connections c ON 
      (c.requested_id=u.id AND c.requester_id=${currentIdentity}) OR
      (c.requested_id=${currentIdentity} AND c.requester_id=u.id)
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
    identity_verified,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image,
    (SELECT
      jsonb_agg(json_build_object(
          'id', id,
          'title', title,
          'description', description,
          'event_at', event_at,
          'created_at', created_at
        ))
        FROM socious_events
        WHERE id=ANY(u.events)
    ) AS events,
    (
	    SELECT COUNT(*)::int
	    FROM connections c2
	    WHERE (c2.requested_id=u.id OR c2.requester_id=u.id) AND c2.status='CONNECTED'
    ) AS connections
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
    (CASE WHEN er.id IS NOT NULL THEN true ELSE false END) AS following,
    (CASE WHEN ing.id IS NOT NULL THEN true ELSE false END) AS follower,
    (c.status) AS connection_status,
    (c.id) AS connection_id,
    mobile_country_code,
    identity_verified,
    is_contributor,
    (SELECT
      jsonb_agg(json_build_object(
          'id', id,
          'title', title,
          'description', description,
          'event_at', event_at,
          'created_at', created_at
        ))
        FROM socious_events ev
        WHERE id=ANY(u.events)
    ) AS events,
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
    jsonb_agg(
        json_build_object(
          'id', oe.id,
          'title', oe.title,
          'description', oe.description,
          'skills', oe.skills,
          'start_at', oe.start_at,
          'end_at', oe.end_at,
          'org', json_build_object(
              'id', oe.org_id,
              'name', oe.org_name,
              'bio', oe.org_bio,
              'shortname', oe.org_shortname,
              'city', oe.org_city,
              'country', oe.org_country,
              'created_at', oe.org_created_at,
              'updated_at', oe.org_updated_at,
              'description', oe.org_description,
              'image', json_build_object(
                'id', oe.org_media_id,
                'url', oe.org_media_url -- Example media fields
              )
          ),
          'job_category', json_build_object(
              'id', oe.job_category_id,
              'name', oe.job_category_name -- Example job category fields
          ),
          'country', oe.country,
          'city', oe.city,
          'employment_type', oe.employment_type,
          'credential', CASE WHEN oe.ec_id IS NULL THEN NULL
              ELSE json_build_object(
                'id', oe.ec_id,
                'status', oe.ec_status,
                'message', oe.ec_message,
                'connection_id', oe.ec_connection_id,
                'connection_url', oe.ec_connection_url,
                'created_at', oe.ec_created_at,
                'updated_at', oe.ec_updated_at
              )
          END
        )
    )
    FROM (
        SELECT 
          e.id, e.title, e.description, e.skills, e.start_at, e.end_at, 
          e.country, e.city, e.employment_type,
          org.id AS org_id, org.name AS org_name, org.bio AS org_bio, 
          org.shortname AS org_shortname, org.city AS org_city, org.country AS org_country, 
          org.created_at AS org_created_at, org.updated_at AS org_updated_at, org.description AS org_description,
          org_media.id AS org_media_id, org_media.url AS org_media_url, -- Explicit media fields
          j.id AS job_category_id, j.name AS job_category_name, -- Explicit job category fields
          ec.id AS ec_id, ec.status AS ec_status, ec.message AS ec_message, 
          ec.connection_id AS ec_connection_id, ec.connection_url AS ec_connection_url, 
          ec.created_at AS ec_created_at, ec.updated_at AS ec_updated_at
        FROM experiences e
        JOIN organizations org ON org.id = e.org_id
        LEFT JOIN media org_media ON org_media.id = org.image
        LEFT JOIN job_categories j ON j.id = e.job_category_id
        LEFT JOIN experience_credentials ec ON ec.experience_id = e.id
        WHERE e.user_id = u.id 
          AND (ec.status IS NULL OR ec.status != 'ISSUED')
        ORDER BY e.start_at DESC
    ) AS oe
  ) AS experiences,
    (SELECT
      jsonb_agg(json_build_object(
          'id', e.id,
          'title', e.title,
          'degree', e.degree,
          'grade', e.grade,
          'description', e.description,
          'start_at', e.start_at,
          'end_at', e.end_at,
          'org', json_build_object(
            'id', org.id,
            'name', org.name,
            'bio', org.bio,
            'shortname', org.shortname,
            'city', org.city,
            'country', org.country,
            'created_at', org.created_at,
            'updated_at', org.created_at,
            'description', org.description,
            'image', row_to_json(org_media.*)
          ),
          'credential', CASE WHEN ec.id IS NULL THEN NULL
          ELSE json_build_object(
            'id', ec.id,
            'status', ec.status,
            'message', ec.message,
            'connection_id', ec.connection_id,
            'connection_url', ec.connection_url,
            'created_at', ec.created_at,
            'updated_at', ec.updated_at
          )
          END
        ))
        FROM educations e
        JOIN organizations org ON org.id=e.org_id
        LEFT JOIN media org_media ON org_media.id=org.image
        LEFT JOIN educations_credentials ec ON ec.education_id=e.id
        WHERE e.user_id=u.id AND (ec.status IS NULL OR ec.status != 'ISSUED')
    ) AS educations,
     (SELECT array_agg(row_to_json(w.*)) FROM wallets w WHERE w.user_id=u.id) AS wallets
    FROM users u 
    LEFT JOIN media avatar ON avatar.id=u.avatar
    LEFT JOIN media cover ON cover.id=u.cover_image
    LEFT JOIN reports r ON r.user_id=u.id AND r.identity_id=${currentIdentity}
    LEFT JOIN follows er ON er.follower_identity_id=${currentIdentity} AND er.following_identity_id=u.id
    LEFT JOIN follows ing ON ing.following_identity_id=${currentIdentity} AND ing.follower_identity_id=u.id
    LEFT JOIN connections c ON 
      (c.requested_id=u.id AND c.requester_id=${currentIdentity}) OR
      (c.requested_id=${currentIdentity} AND c.requester_id=u.id)
    WHERE u.id=ANY(${ids}) AND (r.blocked IS NULL OR r.blocked = false)
    ${sort ? sorting(sort, sortColumns, 'u') : sql`ORDER BY array_position(${ids}, u.id)`}  
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
    identity_verified,
    followers, followings, u.created_at,
    array_to_json(u.social_causes) AS social_causes,
    row_to_json(avatar.*) AS avatar,
    row_to_json(cover.*) AS cover_image,
    (SELECT
      jsonb_agg(json_build_object(
          'id', id,
          'title', title,
          'description', description,
          'event_at', event_at,
          'created_at', created_at
        ))
        FROM socious_events ev
        WHERE id=ANY(u.events)
    ) AS events
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
    LEFT JOIN connections c ON 
      (c.requester_id = u.id OR c.requested_id = u.id ) AND 
      (c.requester_id = ${currentIdentity} OR c.requested_id = ${currentIdentity} )
    WHERE
      (c.status <> 'BLOCKED' OR c.status IS NULL) AND
      u.id <> ${currentIdentity} AND
      u.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns, 'u')}
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
    SELECT
      COUNT(*) OVER () as total_count,
      u.id
    FROM users u
    LEFT JOIN connections c ON 
      (c.requester_id = u.id OR c.requested_id = u.id ) AND 
      (c.requester_id = ${currentIdentity} OR c.requested_id = ${currentIdentity} )
    WHERE
      (c.status <> 'BLOCKED' OR c.status IS NULL) AND
      u.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns, 'u')}
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
