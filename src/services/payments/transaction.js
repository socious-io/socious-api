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
      COUNT(*) OVER () as total_count, p.*, row_to_json(ref.*) as reference,
      row_to_json(i.*) as payer_identity,
      row_to_json(i2.*) as receiver_identity
    FROM payments p
    LEFT JOIN payments ref ON ref.id=p.ref_trx
    JOIN escrows e ON e.payment_id=p.id OR e.payment_id=ref.id
    JOIN projects pr ON pr.id=e.project_id
    JOIN identities i ON i.id=pr.identity_id
    JOIN offers o ON o.id=e.offer_id
    JOIN identities i2 ON i2.id=o.recipient_id
    WHERE p.identity_id=${identityId} OR o.recipient_id=${identityId}
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const getOne = async (id, identityId) => {
  const { rows } = await app.db.query(sql`
    SELECT
      p.*, row_to_json(ref.*) as reference,
      row_to_json(i.*) as payer_identity,
      row_to_json(i2.*) as receiver_identity
    FROM payments p
    LEFT JOIN payments ref ON ref.id=p.ref_trx
    JOIN escrows e ON e.payment_id=p.id OR e.payment_id=ref.id
    JOIN projects pr ON pr.id=e.project_id
    JOIN identities i ON i.id=pr.identity_id
    JOIN offers o ON o.id=e.offer_id
    JOIN identities i2 ON i2.id=o.recipient_id
    WHERE p.id=${id} AND (p.identity_id=${identityId} OR o.recipient_id=${identityId})
  `)
  return rows
}
