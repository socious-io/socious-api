import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import Org from '../organization/index.js'
import Data from '@socious/data'

const get = async (id, identityId) => {
  return app.db.get(sql`
    SELECT i.*,
    (CASE WHEN er.id IS NOT NULL THEN true ELSE false END) AS following,
    (CASE WHEN ing.id IS NOT NULL THEN true ELSE false END) AS follower,
    (c.status) AS connection_status
    FROM identities i
    LEFT JOIN follows er ON er.follower_identity_id=${identityId} AND er.following_identity_id=i.id
    LEFT JOIN follows ing ON ing.following_identity_id=${identityId} AND ing.follower_identity_id=i.id
    LEFT JOIN connections c ON 
      (c.requested_id=${id} AND c.requester_id=${identityId}) OR
      (c.requested_id=${identityId} AND c.requester_id=${id})
    WHERE i.id=${id}
  `)
}

const getByIds = async (ids) => {
  const { rows } = await app.db.query(sql`SELECT * FROM identities WHERE id = ANY(${ids})`)
  return rows
}

const getAll = async (userId, identityId) => {
  const { rows } = await app.db.query(sql`
    SELECT i.*, false AS primary,
      (CASE
        WHEN i.id=${identityId} THEN true
        ELSE false
      END) AS current
    FROM org_members m
    JOIN identities i ON i.id=m.org_id
    WHERE user_id=${userId}
  `)
  const primary = await app.db.get(sql`SELECT * FROM identities WHERE id=${userId}`)
  rows.push({
    current: primary.id === identityId,
    primary: true,
    ...primary
  })
  return rows
}

// TODO: process commission flow
const commissionFee = (identity) => {
  return identity.type === Data.IdentityType.USER ? 0.1 : 0.03
}

const permissioned = async (identity, userId) => {
  switch (identity.type) {
    case Data.IdentityType.ORG:
      await Org.permissioned(identity.id, userId)
      break
    case Data.IdentityType.USER:
      if (userId !== identity.id) throw new PermissionError('Not allow')
      break
    default:
      throw new PermissionError('Not allow')
  }
}

export default {
  get,
  getAll,
  getByIds,
  permissioned,
  commissionFee
}
