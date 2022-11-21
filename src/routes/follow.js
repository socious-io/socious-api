import Router from '@koa/router';
import {BadRequestError} from '../utils/errors.js';
import Follow from '../models/follow/index.js';
import Notif from '../models/notification/index.js';
import Event from '../services/events/index.js';
import {paginate} from '../utils/middlewares/requests.js';
import {loginRequired} from '../utils/middlewares/authorization.js';
import {checkIdParams} from '../utils/middlewares/route.js';

export const router = new Router();

router.get('/followers', loginRequired, paginate, async (ctx) => {
  ctx.body = await Follow.followers(ctx.identity.id, ctx.paginate, {
    type: ctx.query.type,
    name: ctx.query.name,
  });
});

router.get('/followings', loginRequired, paginate, async (ctx) => {
  ctx.body = await Follow.followings(ctx.identity.id, ctx.paginate, {
    type: ctx.query.type,
    name: ctx.query.name,
  });
});

router.post('/:id', loginRequired, checkIdParams, async (ctx) => {
  const followed = await Follow.followed(ctx.identity.id, ctx.params.id);
  if (followed) throw new BadRequestError('Already followed');

  ctx.body = await Follow.follow(ctx.identity.id, ctx.params.id);

  Event.push(Event.Types.NOTIFICATION, ctx.params.id, {
    type: Notif.Types.FOLLOWED,
    refId: ctx.body.id,
    parentId: ctx.identity.id,
    identity: ctx.identity,
  });
});

router.post('/:id/unfollow', loginRequired, checkIdParams, async (ctx) => {
  const followed = await Follow.followed(ctx.identity.id, ctx.params.id);
  if (!followed) throw new BadRequestError('Not followed');

  await Follow.unfollow(ctx.identity.id, ctx.params.id);
  ctx.body = {message: 'success'};
});
