import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'
import { StatusType } from './enums.js'
import { getProfile } from './read.js'
export const insert = async (first_name, last_name, username, email, hashedPasswd) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO users (first_name, last_name, username, email, password, status) 
    VALUES (${first_name}, ${last_name}, ${username.toLowerCase()},
      ${email.toLowerCase()}, ${hashedPasswd}, 'ACTIVE') RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const updateProfile = async (
  id,
  {
    first_name,
    last_name,
    avatar,
    cover_image,
    phone,
    bio,
    city,
    geoname_id,
    address,
    country,
    wallet_address,
    social_causes,
    skills,
    mission,
    language,
    mobile_country_code,
    username,
    certificates,
    goals,
    educations
  }
) => {
  const query = sql`
    UPDATE users SET 
      first_name=${first_name}, last_name=${last_name},
      avatar=${avatar}, cover_image=${cover_image}, phone=${phone}, bio=${bio},
      city=${city}, geoname_id=${geoname_id}, address=${address}, country=${country},
      wallet_address=${wallet_address}, social_causes=${social_causes},
      skills=${skills}, mission=${mission}, language=${language},
      mobile_country_code=${mobile_country_code},username=${username.toLowerCase()},
      certificates=${certificates},goals=${goals}, educations=${educations}
    WHERE id=${id} RETURNING id
  `
  try {
    const { rows } = await app.db.query(query)
    return getProfile(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const updateWalletAddress = async (id, walletAddress) => {
  await app.db.query(sql`UPDATE users SET wallet_address=${walletAddress} WHERE id=${id}`)
}

export const updatePassword = async (id, newPassword) => {
  await app.db.query(sql`UPDATE users SET password=${newPassword}, password_expired=false WHERE id=${id}`)
}

export const expirePassword = async (id) => {
  await app.db.query(sql`UPDATE users SET password_expired=true WHERE id=${id}`)
}

export const verifyEmail = async (id) => {
  await app.db.query(sql`UPDATE users SET email_verified_at=now(),status=${StatusType.ACTIVE} WHERE id=${id}`)
}

export const verifyPhone = async (id) => {
  await app.db.query(sql`UPDATE users SET phone_verified_at=now(),status=${StatusType.ACTIVE} WHERE id=${id}`)
}

export const remove = async (user, reason) => {
  await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      await client.query(
        sql`INSERT INTO deleted_users (user_id, username, reason, registered_at)
    VALUES (${user.id}, ${user.username}, ${reason}, ${user.created_at})`
      )
      await client.query(sql`DELETE FROM users WHERE id=${user.id}`), await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })
}

export const report = async ({ identity_id, user_id, comment, blocked }) => {
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO reports (identity_id, user_id, comment, blocked)
      VALUES (${identity_id}, ${user_id}, ${comment}, ${blocked})
      ON CONFLICT (identity_id, user_id) 
      DO UPDATE SET comment=${comment}, blocked=${blocked}
      RETURNING id
    `)
    return rows[0].id
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const updateImpactPoints = async (user) => {
  return app.db.query(sql`UPDATE users SET impact_points=${user.impact_points} WHERE id=${user.id}`)
}

export const openToWork = async (id) => {
  try {
    const { rows } = await app.db.query(
      sql`UPDATE users SET open_to_work=NOT open_to_work WHERE id=${id} RETURNING open_to_work`
    )
    return rows[0].open_to_work
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const openToVolunteer = async (id) => {
  try {
    const { rows } = await app.db.query(
      sql`UPDATE users SET open_to_volunteer=NOT open_to_volunteer WHERE id=${id} RETURNING open_to_volunteer`
    )
    return rows[0].open_to_volunteer
  } catch (err) {
    throw new EntryError(err.message)
  }
}
