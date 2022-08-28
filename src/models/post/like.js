import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

export const like = async (id, identityId, commentId = null) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT 
      INTO likes (identity_id, post_id, comment_id)
      VALUES(${identityId}, ${id}, ${commentId})
      RETURNING *
    `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const unlike = async (id, identityId, commentId = null) => {
  if (commentId !== null)
    return app.db.query(
      sql`DELETE FROM likes WHERE post_id=${id} AND identity_id=${identityId} AND comment_id=${commentId}`,
    );
  return app.db.query(
    sql`DELETE FROM likes WHERE post_id=${id} AND identity_id=${identityId} AND comment_id IS NULL`,
  );
};
