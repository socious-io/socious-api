import Router from '@koa/router';
import Search from '../services/search/index.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {paginate} from '../utils/middlewares/requests.js';

export const router = new Router();

router.post('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Search.find(
    ctx.request.body,
    {identityId: ctx.identity.id, shouldSave: !ctx.guest},
    ctx.paginate,
  );
});

router.get('/history', loginRequired, paginate, async (ctx) => {
  ctx.body = await Search.history(ctx.identity.id, ctx.paginate);
});
