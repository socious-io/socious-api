import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {BadRequestError, EntryError} from '../../utils/errors.js';

const followed = async (follower, following) => {
  const {rows} = await app.db.query(
    sql`SELECT id FROM follows WHERE follower_identity_id=${follower} AND following_identity_id=${following}`,
  );
  return rows.length > 0;
};

const follow = async (follower, following) => {
  if (follower === following)
    throw new BadRequestError('follower and following could not be same');
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO follows (follower_identity_id, following_identity_id) 
    VALUES (${follower}, ${following}) RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

const unfollow = async (follower, following) => {
  return app.db.query(sql`
    DELETE FROM follows WHERE follower_identity_id=${follower} AND following_identity_id=${following}
  `);
};

export default {
  followed,
  follow,
  unfollow,
};
