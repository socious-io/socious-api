import {app} from '../../index.js';



const posts = async (query) => {
  query = query.replaceAll(/[^A-Za-z0-9 ]/gi, '')
  const {rows} = await app.db.execute('search/posts', `"${query}"`);
  return rows;
}


export default {
  posts
}
