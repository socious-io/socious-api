import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { BadRequestError, EntryError } from '../../utils/errors.js'

export const filterColumns = ['name', 'type']

const followings = async (
  identityId,
  { offset = 0, limit = 10 },
  filter = {}
) => {
  let filtering = ''
  if (filter.name) {
    filtering += ` AND position('${filter.name.toLowerCase()}' IN lower(i.meta->>'name')) > 0`
  }
  if (filter.type) filtering += ` AND i.type='${filter.type.toLowerCase()}'`

  const { rows } = await app.db.query(`
  SELECT 
    COUNT(*) OVER () as total_count,
    f.id,
    i.id AS identity_id,
    i.type AS identity_type,
    i.meta AS identity_meta,
    EXISTS (SELECT id FROM follows WHERE following_identity_id='${identityId}' AND follower_identity_id=i.id) AS mutual,
    true AS following,
    f.created_at
  FROM follows f
  JOIN identities i ON i.id=f.following_identity_id
  WHERE follower_identity_id='${identityId}'
  ${filtering}
  ORDER BY f.created_at DESC  LIMIT ${limit} OFFSET ${offset}`)

  return rows
}

const followers = async (
  identityId,
  { offset = 0, limit = 10 },
  filter = {}
) => {
  let filtering = ''
  if (filter.name) {
    filtering += ` AND position('${filter.name.toLowerCase()}' IN lower(i.meta->>'name')) > 0`
  }
  if (filter.type) filtering += ` AND i.type='${filter.type.toLowerCase()}'`

  const { rows } = await app.db.query(`
  SELECT 
    COUNT(*) OVER () as total_count,
    f.id,
    i.id AS identity_id,
    i.type AS identity_type,
    i.meta AS identity_meta,
    EXISTS (SELECT id FROM follows WHERE follower_identity_id='${identityId}' AND following_identity_id=i.id) AS mutual,
    true AS follower,
    f.created_at
  FROM follows f
  JOIN identities i ON i.id=f.follower_identity_id
  WHERE following_identity_id='${identityId}'
  ${filtering}
  ORDER BY f.created_at DESC  LIMIT ${limit} OFFSET ${offset}`)
  return rows
}

const followed = async (follower, following) => {
  const { rows } = await app.db.query(
    sql`SELECT id FROM follows WHERE follower_identity_id=${follower} AND following_identity_id=${following}`
  )
  return rows.length > 0
}

const follow = async (follower, following) => {
  if (follower === following) {
    throw new BadRequestError('follower and following could not be same')
  }
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO follows (follower_identity_id, following_identity_id) 
    VALUES (${follower}, ${following}) RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

const unfollow = async (follower, following) => {
  return app.db.query(sql`
    DELETE FROM follows WHERE follower_identity_id=${follower} AND following_identity_id=${following}
  `)
}

export default {
  filterColumns,
  followed,
  follow,
  unfollow,
  followings,
  followers
}
