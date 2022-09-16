import Router from '@koa/router';
import {BadRequestError} from '../utils/errors.js';

import Follow from '../models/follow/index.js';
import Notif from '../models/notification/index.js';
import Event from '../services/events/index.js';
import {paginate} from '../utils/requests.js';
import {loginRequired} from '../utils/middlewares/authorization.js';

export const router = new Router();

/**
 * @api {get} /follows/followers Followers
 * @apiGroup Follow
 * @apiName Followers
 * @apiVersion 2.0.0
 * @apiDescription identity followers
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiQuery {String} name
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.identity_id
 * @apiSuccess (200) {String} items.identity_type
 * @apiSuccess (200) {Object} items.identity_meta
 * @apiSuccess (200) {Datetime} items.created_at
 *
 */
router.get('/followers', loginRequired, paginate, async (ctx) => {
  ctx.body = ctx.query.name
    ? await Follow.followersByName(
        ctx.identity.id,
        ctx.query.name,
        ctx.paginate,
      )
    : await Follow.followers(ctx.identity.id, ctx.paginate);
});

/**
 * @api {get} /follows/followings Followings
 * @apiGroup Follow
 * @apiName Followings
 * @apiVersion 2.0.0
 * @apiDescription identity followed
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiQuery {String} name
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.identity_id
 * @apiSuccess (200) {String} items.identity_type
 * @apiSuccess (200) {Object} items.identity_meta
 * @apiSuccess (200) {Datetime} items.created_at
 *
 */
router.get('/followings', loginRequired, paginate, async (ctx) => {
  ctx.body = ctx.query.name
    ? await Follow.followingsByName(
        ctx.identity.id,
        ctx.query.name,
        ctx.paginate,
      )
    : await Follow.followings(ctx.identity.id, ctx.paginate);
});

/**
 * @api {post} /follows/:id Follow
 * @apiGroup Follow
 * @apiName Follow
 * @apiVersion 2.0.0
 * @apiDescription follow an identity
 *
 * @apiParam {String} id following identity id
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiSuccess (200) {Object} follow info object
 *
 */
router.post('/:id', loginRequired, async (ctx) => {
  const followed = await Follow.followed(ctx.identity.id, ctx.params.id);
  if (followed) throw new BadRequestError('Already followed');

  ctx.body = await Follow.follow(ctx.identity.id, ctx.params.id);

  Event.push(Event.Types.NOTIFICATION, ctx.params.id, {
    type: Notif.Types.FOLLOWED,
    refId: ctx.body.id,
    identity: ctx.identity,
  });
});

/**
 * @api {get} /follows/remove/:id Unfollow
 * @apiGroup Follow
 * @apiName Unfollow
 * @apiVersion 2.0.0
 * @apiDescription unfollow an identity
 *
 * @apiParam {String} id following identity id
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiSuccess (200) {Object} success
 *
 */
router.get('/remove/:id', loginRequired, async (ctx) => {
  const followed = await Follow.followed(ctx.identity.id, ctx.params.id);
  if (!followed) throw new BadRequestError('Not followed');

  await Follow.unfollow(ctx.identity.id, ctx.params.id);
  ctx.body = {message: 'success'};
});
