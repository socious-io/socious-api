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
      SELECT referred_by_id, users.wallet_address
      FROM referrings
      LEFT JOIN users ON referred_by_id=users.id
      WHERE
        referred_identity_id=${referredIdentityId} AND
        referrings.created_at > now() - INTERVAL '1 year' AND
        users.identity_verified
    `)
  } catch {
    return null;
  }
}

export default {
  insert,
  get
}
