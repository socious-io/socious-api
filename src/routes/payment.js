import Router from '@koa/router';
import {validate} from '@socious/data';
import {loginRequired} from '../utils/middlewares/authorization.js';
import Payment from '../services/payments/index.js';
import Identity from '../models/identity/index.js';
import Project from '../models/project/index.js';
import {checkIdParams, projectPermission} from '../utils/middlewares/route.js';
import {paginate} from '../utils/middlewares/requests.js';

export const router = new Router();

router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Payment.get(ctx.params.id);
});

router.post('/donate', loginRequired, async (ctx) => {
  await validate.PaymentSchema.validateAsync(ctx.request.body);
  ctx.body = await Payment.charge(ctx.identity.id, ctx.request.body);
});

router.post(
  '/projects/:id',
  loginRequired,
  checkIdParams,
  projectPermission,
  async (ctx) => {
    await validate.PaymentSchema.validateAsync(ctx.request.body);

    const project = await Project.get(ctx.params.id);

    ctx.body = await Payment.charge(ctx.identity.id, {
      ...ctx.request.body,
      currency: project.currency,
      meta: {
        project_name: project.name,
        project_id: project.id,
      },
    });

    // put escrow amount with calculate commission fee
    const amount =
      ctx.body.amount - ctx.body.amount * Identity.commissionFee(ctx.identity);

    await Payment.escrow(ctx.body.id, project.currency, project.id, amount);
  },
);

router.post('/cards', loginRequired, async (ctx) => {
  await validate.CardSchema.validateAsync(ctx.request.body);
  const card = await Payment.newCard(ctx.identity.id, ctx.request.body);

  ctx.body = Payment.responseCard(card);
});

router.post('/cards/remove/:id', loginRequired, checkIdParams, async (ctx) => {
  await Payment.removeCard(ctx.params.id, ctx.identity.id);
  ctx.body = {
    message: 'success',
  };
});

router.post('/cards/update/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.CardSchema.validateAsync(ctx.request.body);
  const card = await Payment.updateCard(
    ctx.params.id,
    ctx.identity.id,
    ctx.request.body,
  );

  ctx.body = Payment.responseCard(card);
});

router.get('/cards', loginRequired, paginate, async (ctx) => {
  const cards = await Payment.getCards(ctx.identity.id, ctx.paginate);
  ctx.body = cards.map((c) => Payment.responseCard(c));
});

router.get('/cards/:id', loginRequired, checkIdParams, async (ctx) => {
  const card = await Payment.getCard(ctx.params.id, ctx.identity.id);
  ctx.body = Payment.responseCard(card);
});
