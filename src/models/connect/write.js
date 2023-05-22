import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'
import { get } from './read.js'

export const send = async (identityId, { requested_id, text }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO connections (requester_id, requested_id, text)
    VALUES (${identityId}, ${requested_id}, ${text})
    RETURNING id
  `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const directBlock = async (identityId, blockedIdentityId) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO connections (requester_id, requested_id, status)
    VALUES (${identityId}, ${blockedIdentityId}, 'BLOCKED')
    ON CONFLICT (relation_id) DO UPDATE SET status='BLOCKED'
    RETURNING id
  `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const accept = async (id) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE connections SET status='CONNECTED', connected_at=now() WHERE id=${id} AND status='PENDING'
      RETURNING id
    `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const block = async (id) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE connections SET status='BLOCKED' WHERE id=${id}
      RETURNING id
    `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}
