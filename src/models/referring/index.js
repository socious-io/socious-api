import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

const insert = async (referredIdentityId, referredById) => {
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO referrings (referred_identity_id, referred_by_id)
        VALUES (${referredIdentityId}, ${referredById})
        RETURNING *
      `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

const get = async (referredIdentityId) => {
  try {
    return await app.db.get(sql`
      SELECT 
        r.referred_by_id,
        u.wallet_address,
        (r.created_at > NOW() - INTERVAL '1 month') AS fee_discount
      FROM referrings r
      LEFT JOIN users u ON r.referred_by_id=u.id
      WHERE
        r.referred_identity_id=${referredIdentityId} AND
        r.created_at > NOW() - INTERVAL '1 year' AND
        u.identity_verified
    `)
  } catch {
    return null
  }
}

export default {
  insert,
  get
}
