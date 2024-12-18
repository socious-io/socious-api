import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

export const newComment = async (id, identityId, { content, reply_id, media_id }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT 
      INTO comments (identity_id, post_id, content, reply_id, media_id)
      VALUES(${identityId}, ${id}, ${content}, ${reply_id}, ${media_id})
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const updateComment = async (id, identityId, { content, media_id }) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE comments SET
      content=${content},
      media_id=${media_id}
    WHERE id=${id} AND identity_id=${identityId}
    RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeComment = async (id, identityId) => {
  return app.db.query(sql`DELETE FROM comments WHERE id=${id} AND identity_id=${identityId}`)
}

export const comments = async (id, currentIdentity, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
  SELECT 
  COUNT(*) OVER () as total_count,
  c.*, i.type  as identity_type, i.meta as identity_meta,
  COALESCE(r.id IS NOT NULL, false) AS reported,
  EXISTS (
    SELECT id FROM likes WHERE post_id=${id} AND 
    identity_id=${currentIdentity} AND
    comment_id=c.id
  ) AS liked,
  row_to_json(m.*) AS media,
  (SELECT
    jsonb_agg(
      json_build_object(
        'id', e.id, 
        'emoji', e.emoji, 
        'identity', row_to_json(ei.*),
        'created_at', e.created_at 
      )
    )
    FROM emojis e
    JOIN identities ei ON ei.id=e.identity_id
    WHERE e.comment_id=c.id
  ) AS emojis
  FROM comments c 
  JOIN identities i ON c.identity_id=i.id
  LEFT JOIN media m ON m.id=c.media_id
  LEFT JOIN reports r ON (r.comment_id=c.id OR r.user_id=c.identity_id) AND r.identity_id=${currentIdentity}
  WHERE c.post_id=${id} AND c.reply_id IS NULL AND (r.blocked IS NULL OR r.blocked = false)
  ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const commentsReplies = async (id, currentIdentity, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
  SELECT COUNT(*) OVER () as total_count,
  c.*, i.type  as identity_type, i.meta as identity_meta,
  COALESCE(r.id IS NOT NULL, false) AS reported,
  EXISTS (
    SELECT id FROM likes WHERE post_id=${id} AND 
    identity_id=${currentIdentity} AND
    comment_id=c.id
  ) AS liked,
  row_to_json(m.*) AS media,
  (SELECT
    jsonb_agg(
      json_build_object(
        'id', e.id, 
        'emoji', e.emoji, 
        'identity', row_to_json(ei.*),
        'created_at', e.created_at
      )
    )
    FROM emojis e
    JOIN identities ei ON ei.id=e.identity_id
    WHERE e.comment_id=c.id
  ) AS emojis
  FROM comments c
  JOIN identities i ON c.identity_id=i.id
  LEFT JOIN media m ON m.id=c.media_id
  LEFT JOIN reports r ON (r.comment_id=c.id OR r.user_id=c.identity_id) AND r.identity_id=${currentIdentity}
  WHERE c.reply_id=${id} AND (r.blocked IS NULL OR r.blocked = false)
  ORDER BY created_at DESC  LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const getComment = async (id, currentIdentity) => {
  return app.db.get(sql`
  SELECT 
  COUNT(*) OVER () as total_count,
  c.*, i.type  as identity_type, i.meta as identity_meta,
  COALESCE(r.id IS NOT NULL, false) AS reported,
  EXISTS (
    SELECT id FROM likes WHERE post_id=${id} AND 
    identity_id=${currentIdentity} AND
    comment_id=c.id
  ) AS liked,
  row_to_json(m.*) AS media,
  (SELECT
    jsonb_agg(
      json_build_object(
        'id', e.id, 
        'emoji', e.emoji, 
        'identity', row_to_json(ei.*),
        'created_at', e.created_at 
      )
    )
    FROM emojis e
    JOIN identities ei ON ei.id=e.identity_id
    WHERE e.comment_id=c.id
  ) AS emojis
  FROM comments c 
  JOIN identities i ON c.identity_id=i.id
  LEFT JOIN media m ON m.id=c.media_id
  LEFT JOIN reports r ON (r.comment_id=c.id OR r.user_id=c.identity_id) AND r.identity_id=${currentIdentity}
  WHERE c.id=${id}
  `)
}

export const getCommentMini = async (id) => {
  return app.db.get(sql`
  SELECT * FROM comments WHERE id=${id}
  `)
}

export const reportComment = async ({ identity_id, comment_id, comment, blocked }) => {
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

export const getCommentReport = async (reportId) => {
  return await app.db.get(sql`
    SELECT r.*,row_to_json(p.*) as post, row_to_json(c.*) as comment,
      i.type AS identity_type, i.meta AS identity_meta,
      (SELECT
        jsonb_agg(json_build_object('url', m.url, 'id', m.id))
        FROM media m
        WHERE m.id=ANY(p.media)
      ) AS media
    FROM reports r
    JOIN comments c ON r.comment_id=c.id
    JOIN posts p ON c.post_id=p.id
    JOIN identities i ON r.identity_id=i.id
    WHERE r.id=${reportId}
  `)
}
