import Router from '@koa/router';
import {validate} from '@socious/data';
import {loginRequired} from '../utils/middlewares/authorization.js';
import Payment from '../services/payments/index.js';
import Project from '../models/project/index.js';
import {checkIdParams} from '../utils/middlewares/route.js';

export const router = new Router();

router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Payment.get(ctx.params.id);
});

router.post('/donate', loginRequired, async (ctx) => {
  await validate.PaymentSchema.validateAsync(ctx.request.body);

  ctx.body = await Payment.checkout({
    ...ctx.request.body,
    name: `Donate-${ctx.identity.username || ctx.identity.shortname}`,
    identity_id: ctx.identity.id,
  });
});

router.post(
  '/project/:id/escrow',
  loginRequired,
  checkIdParams,
  async (ctx) => {
    await validate.PaymentSchema.validateAsync(ctx.request.body);

    const project = await Project.get(ctx.params.id);

    ctx.body = await Payment.checkout({
      ...ctx.request.body,
      name: project.name,
      currency: project.currency,
      identity_id: ctx.identity.id,
      meta: {
        project_id: project.id,
      },
    });
  },
);

router.post('/:id/verify', loginRequired, checkIdParams, async (ctx) => {
  const success = await Payment.verify(ctx.params.id);
  ctx.body = {
    message: success ? 'success' : 'fail',
    code: success ? 1 : 0,
  };
});

router.post('/:id/cancel', loginRequired, checkIdParams, async (ctx) => {
  await Payment.cancel(ctx.params.id);
  ctx.body = {
    message: 'success',
  };
});
