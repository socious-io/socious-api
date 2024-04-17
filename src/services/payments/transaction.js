import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const create = async (
  { identity_id, amount, currency, service, meta, source, referrers_fee, ref_trx = null },
  client
) => {
  const db = client || app.db
  try {
    const { rows } = await db.query(sql`
  INSERT INTO payments (identity_id, amount, currency, service, meta, source, referrers_fee, ref_trx)
  VALUES (${identity_id}, ${amount}, ${currency}, ${service}, ${meta}, ${source}, ${referrers_fee}, ${ref_trx})
  RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err)
  }
}

export const setTrx = async (id, transaction, client) => {
  const db = client || app.db
  try {
    const { rows } = await db.query(sql`
      UPDATE payments SET transaction_id=${transaction} WHERE id=${id}
      RETURNING *
    `)
    return rows[0].id
  } catch (err) {
    throw new EntryError(err)
  }
}

export const setCompleteTrx = async (id, transaction) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE payments 
      SET 
        transaction_id=${transaction},
        verified_at=now()
      WHERE id=${id}
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err)
  }
}

export const complete = async (id) => {
  return app.db.query(sql`
      UPDATE payments SET verified_at=now() WHERE id=${id} AND verified_at IS NULL
      RETURNING *
    `)
}

export const cancel = async (id) => {
  return app.db.query(sql`
      UPDATE payments SET canceled_at=now() WHERE id=${id} AND cenceled_at IS NULL
      RETURNING *
    `)
}

export const get = async (id, identityId) => {
  return app.db.get(sql`SELECT * FROM payments WHERE id=${id} AND identity_id=${identityId}`)
}

export const all = async (identityId, { limit = 10, offset = 0 }) => {
  const { rows } = await app.db.query(sql`
    SELECT 
      COUNT(*) OVER () as total_count, p.*,  row_to_json(ref.*) as reference
    FROM payments p
    LEFT JOIN payments ref ON ref.id=p.ref_trx
    WHERE p.identity_id=${identityId}
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}    
  `)
  return rows
}
