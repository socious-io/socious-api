import Router from '@koa/router';
import Identity from '../models/identity/index.js';
import {loginRequired} from '../utils/middlewares/authorization.js';
import {checkIdParams} from '../utils/middlewares/route.js';

export const router = new Router();

router.get('/', loginRequired, async (ctx) => {
  ctx.body = await Identity.getAll(ctx.user.id, ctx.identity.id);
});

router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Identity.get(ctx.params.id, ctx.identity.id);
});

router.get('/set/:id/session', loginRequired, checkIdParams, async (ctx) => {
  const identity = await Identity.get(ctx.params.id);
  await Identity.permissioned(identity, ctx.user.id);

  ctx.session.current_identity = identity.id;

  ctx.body = {message: 'success'};
});
