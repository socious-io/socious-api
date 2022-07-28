import Router from '@koa/router';
import Identity from '../models/identity/index.js';
import {identity} from '../utils/requests.js';

export const router = new Router();

router.get('/:id', async (ctx) => {
  ctx.body = await Identity.get(ctx.params.id);
});

router.get('/', identity, async (ctx) => {
  ctx.body = ctx.identity;
});
