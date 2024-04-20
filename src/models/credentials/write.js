import sql, { raw } from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'
export const requestOrgVerification = async (identityId, medias) => {
  let verification = {}, documents = [];
  await app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      verification = await client.query(sql`
      INSERT INTO org_verification_credentials (identity_id)
      VALUES
        (${identityId})
      RETURNING *
    `)
      verification = verification.rows[0]

      documents = await client.query(
        raw(`
        INSERT INTO org_verification_documents (media_id, verification_id)
        VALUES
        ${medias.map((media) => `('${media}','${verification.id}')`)}
        RETURNING *
    `)
      )
      documents = documents.rows
      //query
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })

  return { verification, documents }
}

export const requestVerification = async (identityId, connectionId, connectionUrl) => {
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO verification_credentials (
        identity_id,
        connection_id,
        connection_url
      ) VALUES (
        ${identityId},
        ${connectionId},
        ${connectionUrl}
      )
      ON CONFLICT (identity_id) DO 
      UPDATE SET 
        connection_id = EXCLUDED.connection_id,
        connection_url = EXCLUDED.connection_url
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const setPresent = async (id, presentId) => {
  try {
    const { rows } = await app.db.query(sql`    
    UPDATE verification_credentials SET present_id=${presentId}, updated_at=NOW()
    WHERE id=${id}
    RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const setVerificationApproved = async (id, body) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE verification_credentials SET status='APPROVED', body=${body}, updated_at=NOW() 
      WHERE id=${id}
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const setVerificationRejected = async (id) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE verification_credentials SET status='REJECTED' WHERE id=${id}
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const requestExperience = async (id, userId, orgId, message, exact_info, options = {}) => {
  const status = options.issued ? 'ISSUED' : 'PENDING'
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO experience_credentials (
        user_id,
        org_id,
        experience_id,
        message,
        exact_info,
        status
      ) VALUES (
        ${userId},
        ${orgId},
        ${id},
        ${message},
        ${exact_info},
        ${status}
      )
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const requestedExperienceUpdate = async ({ id, status, connection_id = null, connection_url = null }) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE experience_credentials SET
        status=${status},
        connection_id=${connection_id},
        connection_url=${connection_url},
        updated_at=Now()
      WHERE id=${id}
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const requestEducation = async (id, userId, orgId, message, options = {}) => {
  const status = options.issued ? 'ISSUED' : 'PENDING'
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO educations_credentials (
        user_id,
        org_id,
        education_id,
        message,
        status
      ) VALUES (
        ${userId},
        ${orgId},
        ${id},
        ${message},
        ${status}
      )
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const requestedEducationUpdate = async ({ id, status, connection_id = null, connection_url = null }) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE educations_credentials SET
        status=${status},
        connection_id=${connection_id},
        connection_url=${connection_url},
        updated_at=Now()
      WHERE id=${id}
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}
