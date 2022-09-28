import Router from '@koa/router';
import {validate} from '@socious/data';
import {
  loginRequired,
} from '../utils/middlewares/authorization.js';
import Payment from '../services/payments/index.js';

export const router = new Router();




router.post('/donate', loginRequired, async (ctx) => {

  await validate.DonateSchema.validateAsync(ctx.request.body);

  ctx.body = await Payment.checkout({
    name: `Donate-${ctx.identity.username || ctx.identity.shortname}`,
    identity_id: ctx.identity.id,
    ...ctx.request.body
  })
});
