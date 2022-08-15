import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';
import {upsertSchem} from './schema.js';
import sanitizeHtml from 'sanitize-html';

export const insert = async (identity_id, body) => {
  await upsertSchem.validateAsync(body);

  body.content = sanitizeHtml(body.content);

  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO posts (content, identity_id, causes_tags, hashtags, identity_tags, image) 
        VALUES (${body.content}, ${identity_id}, ${body.causes_tags}, ${body.hashtags}, ${body.identity_tags}, ${body.image})
        RETURNING *, array_to_json(posts.causes_tags) AS causes_tags`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (id, body) => {
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
        image=${body.image}
      WHERE id=${id} RETURNING *, array_to_json(posts.causes_tags) AS causes_tags`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  await app.db.query(sql`DELETE FROM posts WHERE id=${id}`);
};
