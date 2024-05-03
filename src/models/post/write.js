import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'
import sanitizeHtml from 'sanitize-html'
import { get } from './read.js'

export const insert = async (identityId, { title, content, causes_tags, hashtags, identity_tags, media }) => {
  content = sanitizeHtml(content)

  try {
    const { rows } = await app.db.query(
      sql`
      INSERT INTO posts (title, content, identity_id, causes_tags, hashtags, identity_tags, media) 
        VALUES (${title}, ${content}, ${identityId}, ${causes_tags}, ${hashtags}, ${identity_tags}, ${media})
        RETURNING id`
    )
    return get(rows[0].id, identityId)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const update = async (id, identityId, { title, content, causes_tags, hashtags, identity_tags, media }) => {
  content = sanitizeHtml(content)

  try {
    const { rows } = await app.db.query(
      sql`
      UPDATE posts SET
        title=${title},
        content=${content},
        causes_tags=${causes_tags},
        hashtags=${hashtags},
        identity_tags=${identity_tags},
        media=${media}
      WHERE id=${id} RETURNING id`
    )
    return get(rows[0].id, identityId)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const share = async (id, identityId, { content }) => {
  content = sanitizeHtml(content || '')

  try {
    const { rows } = await app.db.query(
      sql`
      INSERT INTO posts (shared_id, identity_id, content)
        VALUES (${id}, ${identityId}, ${content})
        RETURNING id`
    )
    return get(rows[0].id, identityId)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const remove = async (id) => {
  await app.db.query(sql`DELETE FROM posts WHERE id=${id}`)
}

export const report = async ({ identity_id, post_id, comment, blocked }) => {
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO reports (identity_id, post_id, comment, blocked)
      VALUES (${identity_id}, ${post_id}, ${comment}, ${blocked})
      ON CONFLICT (identity_id, post_id) 
      DO UPDATE SET comment=${comment}, blocked=${blocked}
      RETURNING id
    `)
    return rows[0].id
  } catch (err) {
    throw new EntryError(err.message)
  }
}
