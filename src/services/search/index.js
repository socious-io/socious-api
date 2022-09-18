import Data from '@socious/data'
import {app} from '../../index.js';


const typesNeedUser = [Data.SearchType.USERS, Data.SearchType.RELATED_USERS];



const find = async (body, {offset = 0, limit = 10}) => {
  await Data.SearchSchema.validateAsync(body);

  const query = body.q.replaceAll(
    /[^\p{Letter}\p{Number}\p{Separator}]/gu,
    ' ',
  );
  const name = `search/${body.type}`;

  const params = [
    `"${query}"`,
    limit,
    offset,
    typesNeedUser.includes(body.type) ? body.current_user_id : undefined,
  ].filter((p) => p !== undefined);

  const {rows} = await app.db.execute(name, ...params);

  return rows;
};

export default {
  find,
};
