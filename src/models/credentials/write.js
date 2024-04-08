import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

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
      UPDATE SET connection_id = ${connectionId}, connection_url = ${connectionUrl}
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

  const {issuedByOrg} = options;

  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO experience_credentials (
        user_id,
        org_id,
        experience_id,
        message,
        exact_info,
        is_issued
      ) VALUES (
        ${userId},
        ${orgId},
        ${id},
        ${message},
        ${exact_info},
        ${issuedByOrg}
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
