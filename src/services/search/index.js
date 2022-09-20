import Post from '../../models/post/index.js'
import User from '../../models/user/index.js'
import Org from '../../models/organization/index.js'
import Project from '../../models/project/index.js'
import Data from '@socious/data'
import {app} from '../../index.js';
import {filtering} from '../../utils/filtering.js'


const typesNeedUser = [Data.SearchType.USERS, Data.SearchType.RELATED_USERS];

const filterColumns = (type) => {
  switch (type) {
    case Data.SearchType.POSTS:
      return Post.filterColumns
    case Data.SearchType.USERS:
      return User.filterColumns
    case Data.SearchType.RELATED_USERS: 
      return User.filterColumns
    case Data.SearchType.PROJECTS:
      return Project.filterColumns
    case Data.SearchType.ORGANIZATIONS:
      return Org.filterColumns
    default:
      return []
  }
}

const fetch = async (type, ids, {offset, limit}) => {
  ids = ids.slice(offset, offset+limit)  
  const {rows} = await Org.getAll(ids)
  
  return rows.map(r => {
    return {
      total_count: ids.length,
      ...r
    }
  })
}


const find = async (body, {offset = 0, limit = 10}) => {
  await Data.SearchSchema.validateAsync(body);

  const query = body.q.replaceAll(
    /[^\p{Letter}\p{Number}\p{Separator}]/gu,
    ' ',
  );
  const name = `search/${body.type}`;
  const params = [
    `"${query}"`,
    typesNeedUser.includes(body.type) ? body.current_user_id : undefined,
    
  ].filter((p) => p !== undefined);
  console.log(filterColumns)
  let filters = filtering(body.filter, filterColumns(body.type))
  if (filters) filters = 'AND ' + filters


  const {rows} = await app.db.execute(name, params, {filter: filters});

  return fetch(body.type, rows.map(r => r.id), {offset, limit})
};

export default {
  find,
};
