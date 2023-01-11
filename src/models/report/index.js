import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

const report = async ({
  identity_id,
  post_id,
  user_id,
  comment_id,
  org_id,
  comment,
  blocked,
}) => {
  try {
    const {rows} = await app.db.query(sql`
      INSERT INTO reports (identity_id, post_id, user_id, comment_id, org_id, comment, blocked)
      VALUES (${identity_id}, ${post_id}, ${user_id}, ${comment_id}, ${org_id}, ${comment}, ${blocked})
      RETURNIN id
    `);
    return rows[0].id;
  } catch (err) {
    throw EntryError(err.message);
  }
};

export default {
  report,
};
