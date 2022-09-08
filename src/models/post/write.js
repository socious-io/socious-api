import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {upsertSchem} from './schema.js';
import sanitizeHtml from 'sanitize-html';
import {get} from './read.js';

export const insert = async (identityId, body) => {
  await upsertSchem.validateAsync(body);

  body.content = sanitizeHtml(body.content);

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO posts (content, identity_id, causes_tags, hashtags, identity_tags, media) 
        VALUES (${body.content}, ${identityId}, ${body.causes_tags}, ${body.hashtags}, ${body.identity_tags}, ${body.media})
        RETURNING id`,
    );
    return get(rows[0].id, identityId);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (id, identityId, body) => {
  await upsertSchem.validateAsync(body);

  body.content = sanitizeHtml(body.content);

  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE posts SET
        content=${body.content},
        causes_tags=${body.causes_tags},
        hashtags=${body.hashtags},
        identity_tags=${body.identity_tags},
        media=${body.media}
      WHERE id=${id} RETURNING id`,
    );
    return get(rows[0].id, identityId);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const share = async (id, identityId, body) => {
  body.content = sanitizeHtml(body.content);

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO posts (shared_id, identity_id, content)
        VALUES (${id}, ${identityId}, ${body.content})
        RETURNING id`,
    );
    return get(rows[0].id, identityId);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  await app.db.query(sql`DELETE FROM posts WHERE id=${id}`);
};
