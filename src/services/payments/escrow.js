import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const escrow = async ({ trx_id, project_id, offer_id, currency, amount }) => {
  try {
    const rows = await app.db.query(sql`
    INSERT INTO escrows (project_id, payment_id, offer_id, amount, currency)
      VALUES(${project_id}, ${trx_id}, ${offer_id}, ${amount}, ${currency})
    RETURNING *
  `)

    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const setEscrowMission = async (id, missionId) => {
  try {
    const rows = await app.db.query(sql`
      UPDATE escrows SET mission_id=${missionId}  WHERE id=${id}
      RETURNING *
    `)

    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const totalEscrow = async (projectId) => {
  const row = await app.db.get(sql`
    SELECT SUM(amount) FROM escrows WHERE project_id=${projectId} AND released_at IS NULL
  `)

  return row.sum
}

export const getEscrow = async (missionId) => {
  return app.db.get(sql`SELECT * FROM escrows WHERE mission_id=${missionId} AND released_at IS NULL`)
}

export const releaseEscrow = async (id, releaseId) => {
  try {
      const rows = app.db.query(sql`
      UPDATE escrows SET release_id=${releaseId}, released_at=NOW() WHERE id=${id}
      RETURNING *
      `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const getOpenEscrow = async (offerId, amount) => {
  return app.db.get(sql`
    SELECT * FROM escrows 
    WHERE 
      offer_id=${offerId} AND 
      amount >= ${amount} AND 
      released_at IS NULL AND 
      mission_id IS NULL     
    ORDER BY amount ASC
    LIMIT 1
  `)
}
