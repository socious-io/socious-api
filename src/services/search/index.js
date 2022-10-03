import sql from 'sql-template-tag';
import Post from '../../models/post/index.js';
import User from '../../models/user/index.js';
import Org from '../../models/organization/index.js';
import Project from '../../models/project/index.js';
import Data from '@socious/data';
import {app} from '../../index.js';
import {filtering} from '../../utils/filtering.js';

const typesNeedUser = [Data.SearchType.USERS, Data.SearchType.RELATED_USERS];

const filterColumns = (type) => {
  switch (type) {
    case Data.SearchType.POSTS:
      return Post.filterColumns;
    case Data.SearchType.USERS:
      return User.filterColumns;
    case Data.SearchType.RELATED_USERS:
      return User.filterColumns;
    case Data.SearchType.PROJECTS:
      return Project.filterColumns;
    case Data.SearchType.ORGANIZATIONS:
      return Org.filterColumns;
    default:
      return [];
  }
};

const addHistory = async (body, identityId) => {
  await app.db.query(sql`
  INSERT INTO search_history (identity_id, body)
  VALUES (${identityId}, ${body})
  `);
};

const fetch = async (type, ids, {offset, limit}) => {
  const selectedIds = ids.slice(offset, offset + limit);
  let rows = [];
  switch (type) {
    case Data.SearchType.POSTS:
      rows = await Post.getAll(selectedIds);
      break;
    case Data.SearchType.USERS:
      rows = await User.getAllProfile(selectedIds);
      break;
    case Data.SearchType.RELATED_USERS:
      rows = await User.getAllProfile(selectedIds);
      break;
    case Data.SearchType.PROJECTS:
      rows = await Project.getAll(selectedIds);
      break;
    case Data.SearchType.ORGANIZATIONS:
      rows = await Org.getAll(selectedIds);
      break;
  }

  return rows.map((r) => {
    return {
      total_count: ids.length,
      ...r,
    };
  });
};

const find = async (
  body,
  {userId, identityId, shouldSave},
  {offset = 0, limit = 10},
) => {
  await Data.SearchSchema.validateAsync(body);

  const query = body.q.replaceAll(
    /[^\p{Letter}\p{Number}\p{Separator}]/gu,
    ' ',
  );
  const name = `search/${body.type}`;
  const params = [
    `"${query}"`,
    typesNeedUser.includes(body.type) ? userId : undefined,
  ].filter((p) => p !== undefined);

  if (shouldSave) await addHistory(body, identityId);

  let filters = filtering(body.filter, filterColumns(body.type));

  if (filters) filters = 'AND ' + filters;

  const {rows} = await app.db.execute(name, params, {filter: filters});
  return fetch(
    body.type,
    rows.map((r) => r.id),
    {offset, limit},
  );
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
