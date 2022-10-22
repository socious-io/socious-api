import sql from 'sql-template-tag';
import Post from '../../models/post/index.js';
import User from '../../models/user/index.js';
import Org from '../../models/organization/index.js';
import Project from '../../models/project/index.js';
import Data from '@socious/data';
import {app} from '../../index.js';
import {BadRequestError} from '../../utils/errors.js';

const addHistory = async (body, identityId) => {
  await app.db.query(sql`
  INSERT INTO search_history (identity_id, body)
  VALUES (${identityId}, ${body})
  `);
};

const find = async (body, {identityId, shouldSave}, paginate) => {
  await Data.SearchSchema.validateAsync(body);

  const options = {...paginate, filter: body.filter, sort: body.sort};

  if (shouldSave) await addHistory(body, identityId);

  switch (body.type) {
    case Data.SearchType.POSTS:
      return Post.search(body.q, identityId, options);

    case Data.SearchType.USERS:
      return User.search(body.q, identityId, options);

    case Data.SearchType.RELATED_USERS:
      return User.searchRelateds(body.q, identityId, options);

    case Data.SearchType.PROJECTS:
      return Project.search(body.q, options);

    case Data.SearchType.ORGANIZATIONS:
      return Org.search(body.q, options);

    default:
      throw new BadRequestError(`type '${body.type}' is not valid`);
  }
};

const history = async (identityId, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
  SELECT COUNT(*) OVER () as total_count, *
  FROM search_history WHERE identity_id=${identityId}
  ORDER BY created_at desc LIMIT ${limit} OFFSET ${offset}
  `);
  return rows;
};

export default {
  find,
  history,
};
