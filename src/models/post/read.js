import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { filtering, textSearch, sorting } from '../../utils/query.js'

export const filterColumns = {
  causes_tags: Array,
  hashtags: Array,
  identity_tags: Array,
  identity_id: String
}

export const sortColumns = ['created_at', 'updated_at']

export const all = async (
  currentIdentity,
  { offset = 0, limit = 10, filter, sort }
) => {
  const { rows } = await app.db.query(
    sql`SELECT 
      COUNT(*) OVER () as total_count,
      posts.*, i.type  as identity_type, i.meta as identity_meta,
      array_to_json(posts.causes_tags) as causes_tags,
      EXISTS (SELECT id FROM likes WHERE (post_id=posts.id OR post_id=posts.shared_id) AND identity_id=${currentIdentity}) AS liked,
      COALESCE(r.id IS NOT NULL, false) AS reported,
      row_to_json(sp.*) AS shared_post,
      row_to_json(sp_i.*) AS shared_from_identity,
      (SELECT
        jsonb_agg(json_build_object('url', m.url, 'id', m.id))
        FROM media m
        WHERE m.id=ANY(posts.media) OR m.id=ANY(sp.media)
      ) AS media
    FROM posts 
    JOIN identities i ON posts.identity_id=i.id
    LEFT JOIN posts sp ON sp.id = posts.shared_id
    LEFT JOIN identities sp_i ON sp.identity_id = sp_i.id
    LEFT JOIN reports r ON (r.post_id=posts.id OR r.user_id=posts.identity_id) AND r.identity_id=${currentIdentity}
    WHERE (r.blocked IS NULL OR r.blocked = false)
    ${filtering(filter, filterColumns, true, 'posts')}
    ${sorting(sort, sortColumns, 'posts')}
    LIMIT ${limit} OFFSET ${offset}`
  )

  return rows
}

export const get = async (id, currentIdentity) => {
  return app.db.get(sql`
  SELECT posts.*,
    array_to_json(posts.causes_tags) as causes_tags,
    i.type AS identity_type, i.meta AS identity_meta, 
    EXISTS (SELECT id FROM likes WHERE (post_id=posts.id OR post_id=posts.shared_id) AND identity_id=${currentIdentity}) AS liked,
    COALESCE(r.id IS NOT NULL, false) AS reported,
    (SELECT
      jsonb_agg(json_build_object('url', m.url, 'id', m.id))
      FROM media m
      WHERE m.id=ANY(posts.media) OR m.id=ANY(sp.media)
    ) AS media,
    row_to_json(sp.*) AS shared_post,
    row_to_json(sp_i.*) AS shared_from_identity
  FROM posts 
  JOIN identities i ON posts.identity_id=i.id
  LEFT JOIN posts sp ON sp.id = posts.shared_id
  LEFT JOIN identities sp_i ON sp.identity_id = sp_i.id
  LEFT JOIN reports r ON (r.post_id=posts.id OR r.user_id=posts.identity_id) AND r.identity_id=${currentIdentity}
  WHERE posts.id=${id} AND (r.blocked IS NULL OR r.blocked = false)
  `)
}

export const getAll = async (ids, currentIdentity, sort) => {
  const { rows } = await app.db.query(sql`
    SELECT posts.*,
      array_to_json(posts.causes_tags) as causes_tags,
      i.type AS identity_type, i.meta AS identity_meta, 
      EXISTS (SELECT id FROM likes WHERE (post_id=posts.id OR post_id=posts.shared_id) AND identity_id=${currentIdentity}) AS liked,
      COALESCE(r.id IS NOT NULL, false) AS reported,
      (SELECT
        jsonb_agg(json_build_object('url', m.url, 'id', m.id))
        FROM media m
        WHERE m.id=ANY(posts.media) OR m.id=ANY(sp.media)
      ) AS media,
      row_to_json(sp.*) AS shared_post,
      row_to_json(sp_i.*) AS shared_from_identity
    FROM posts 
    JOIN identities i ON posts.identity_id=i.id
    LEFT JOIN posts sp ON sp.id = posts.shared_id
    LEFT JOIN identities sp_i ON sp.identity_id = sp_i.id
    LEFT JOIN reports r ON (r.post_id=posts.id OR r.user_id=posts.identity_id) AND r.identity_id=${currentIdentity}
    WHERE posts.id=ANY(${ids}) AND (r.blocked IS NULL OR r.blocked = false)
    ${sorting(sort, sortColumns, 'posts')}
  `)
  return rows
}

export const search = async (
  q,
  currentIdentity,
  { offset = 0, limit = 10, filter, sort }
) => {
  const { rows } = await app.db.query(sql`
    SELECT
      p.id
    FROM posts p
    WHERE
      p.search_tsv @@ to_tsquery(${textSearch(q)})
      ${filtering(filter, filterColumns)}
    ${sorting(sort, sortColumns)}`)

  const posts = await getAll(
    rows.map((r) => r.id).slice(offset, offset + limit),
    currentIdentity,
    sort
  )

  return posts.map((r) => {
    return {
      total_count: rows.length,
      ...r
    }
  })
}

export const miniGet = async (id) => {
  return app.db.get(sql`SELECT * FROM POSTS WHERE id=${id}`)
}

export const permissioned = async (identityId, id) => {
  const post = await miniGet(id)
  if (post.identity_id !== identityId) throw new PermissionError('Not allow')
}
