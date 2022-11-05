import Router from '@koa/router';
import {checkIdParams} from '../utils/middlewares/route.js';
import {mailbox, message} from '../services/email/read.js';

export const router = new Router();

router.get('/:address/:id', checkIdParams, async (ctx) => {
  ctx.body = await message(ctx.params.address, ctx.params.id);
});

router.get('/:address', checkIdParams, async (ctx) => {
  ctx.body = await mailbox(ctx.params.address);
});
