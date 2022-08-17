import Router from '@koa/router';
import Search from '../services/search/index.js';


export const router = new Router();


router.get('/posts', async (ctx) => {  
  ctx.body = await Search.posts(ctx.query.q)
})
