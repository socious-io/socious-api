import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const newComment = async (id, identityId, { content, reply_id }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT 
      INTO comments (identity_id, post_id, content, reply_id)
      VALUES(${identityId}, ${id}, ${content}, ${reply_id})
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const updateComment = async (id, identityId, { content }) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE comments SET
      content=${content}
    WHERE id=${id} AND identity_id=${identityId}
    RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeComment = async (id, identityId) => {
  return app.db.query(
    sql`DELETE FROM comments WHERE id=${id} AND identity_id=${identityId}`
  )
}

export const comments = async (
  id,
  currentIdentity,
  { offset = 0, limit = 10 }
) => {
  const { rows } = await app.db.query(sql`
  SELECT 
  COUNT(*) OVER () as total_count,
  c.*, i.type  as identity_type, i.meta as identity_meta,
  COALESCE(r.id IS NOT NULL, false) AS reported,
  EXISTS (
    SELECT id FROM likes WHERE post_id=${id} AND 
    identity_id=${currentIdentity} AND
    comment_id=c.id
  ) AS liked
  FROM comments c 
  JOIN identities i ON c.identity_id=i.id
  LEFT JOIN reports r ON (r.comment_id=c.id OR r.user_id=c.identity_id) AND r.identity_id=${currentIdentity}
  WHERE c.post_id=${id} AND c.reply_id IS NULL AND (r.blocked IS NULL OR r.blocked = false)
  ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const commentsReplies = async (
  id,
  currentIdentity,
  { offset = 0, limit = 10 }
) => {
  const { rows } = await app.db.query(sql`
  SELECT COUNT(*) OVER () as total_count,
  c.*, i.type  as identity_type, i.meta as identity_meta,
  COALESCE(r.id IS NOT NULL, false) AS reported,
  EXISTS (
    SELECT id FROM likes WHERE post_id=${id} AND 
    identity_id=${currentIdentity} AND
    comment_id=c.id
  ) AS liked
  FROM comments c 
  JOIN identities i ON c.identity_id=i.id
  LEFT JOIN reports r ON (r.comment_id=c.id OR r.user_id=c.identity_id) AND r.identity_id=${currentIdentity}
  WHERE c.reply_id=${id} AND (r.blocked IS NULL OR r.blocked = false)
  ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const getComment = async (id) => {
  return app.db.get(sql`SELECT * FROM comments WHERE id=${id}`)
}

export const reportComment = async ({
  identity_id,
  comment_id,
  comment,
  blocked
}) => {
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO reports (identity_id, comment_id, comment, blocked)
      VALUES (${identity_id}, ${comment_id}, ${comment}, ${blocked})
      ON CONFLICT (identity_id, comment_id)
      DO UPDATE SET comment=${comment}, blocked=${blocked}
      RETURNING id
    `)
    return rows[0].id
  } catch (err) {
    throw new EntryError(err.message)
  }
}
