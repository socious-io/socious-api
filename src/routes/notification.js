import Router from '@koa/router';
import Notif from '../models/notification/index.js';
import {loginRequired} from '../utils/middlewares/authorization.js';
import {paginate} from '../utils/middlewares/requests.js';
import {checkIdParams} from '../utils/middlewares/route.js';
import {validate} from '@socious/data';
export const router = new Router();

router.get('/settings', loginRequired, async (ctx) => {
  ctx.body = {
    settings: await Notif.settings(ctx.user.id),
  };
});

router.post('/settings', loginRequired, async (ctx) => {
  await validate.NotificationsSettingsSchema.validateAsync(ctx.request.body);
  ctx.body = {
    settings: await Notif.updateSettings(
      ctx.user.id,
      ctx.request.body.settings,
    ),
  };
});

router.get('/unreads', loginRequired, paginate, async (ctx) => {
  const notifications = await Notif.allUnreads(ctx.user.id, ctx.paginate);

  await Notif.viewed(
    ctx.user.id,
    notifications.map((n) => n.id),
  );

  ctx.body = notifications;
});

router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  const notif = await Notif.get(ctx.user.id, ctx.params.id);
  await Notif.read(ctx.user.id, [ctx.params.id]);
  ctx.body = notif;
});

router.get('/', loginRequired, paginate, async (ctx) => {
  let notifications = [];
  if (JSON.parse(ctx.request.query.unreads || null)) {
    notifications = await Notif.allUnreads(ctx.user.id, ctx.paginate);
  } else {
    notifications = await Notif.all(ctx.user.id, ctx.paginate);
  }

  await Notif.viewed(
    ctx.user.id,
    notifications.map((n) => n.id),
  );

  ctx.body = notifications;
});

router.post('/read/all', loginRequired, async (ctx) => {
  await Notif.readAll(ctx.user.id);
  ctx.body = {message: 'success'};
});

router.post('/read/:id', loginRequired, checkIdParams, async (ctx) => {
  await Notif.read(ctx.user.id, [ctx.params.id]);
  ctx.body = {message: 'success'};
});
