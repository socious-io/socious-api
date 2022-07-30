import Router from '@koa/router';
import {BadRequestError} from '../utils/errors.js';

import Follow from '../models/follow/index.js';
import {identity} from '../utils/requests.js';

export const router = new Router();

/**
 * @api {put} /follows/:id Follow
 * @apiGroup Follow
 * @apiName Follow
 * @apiVersion 1.0.0
 * @apiDescription follow an identity
 *
 * @apiParam {String} id following identity id
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 */
router.put('/:id', identity, async (ctx) => {
  const followed = await Follow.followed(ctx.identity.id, ctx.params.id);
  if (followed) throw new BadRequestError('Already followed');

  ctx.body = await Follow.follow(ctx.identity.id, ctx.params.id);
});

/**
 * @api {delete} /follows/:id Unfollow
 * @apiGroup Follow
 * @apiName Unfollow
 * @apiVersion 1.0.0
 * @apiDescription unfollow an identity
 *
 * @apiParam {String} id following identity id
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 */
router.delete('/:id', identity, async (ctx) => {
  const followed = await Follow.followed(ctx.identity.id, ctx.params.id);
  if (!followed) throw new BadRequestError('Not followed');

  await Follow.unfollow(ctx.identity.id, ctx.params.id);
  ctx.body = {message: 'success'};
});
