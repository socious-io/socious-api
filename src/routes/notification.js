import Router from '@koa/router';
import Notif from '../models/notification/index.js';
import {loginRequired} from '../utils/middlewares/authorization.js';
import {paginate} from '../utils/requests.js';
import {checkIdParams} from '../utils/middlewares/route.js';
export const router = new Router();

/**
 * @api {get} /notifications/unreads Get unreads
 * @apiGroup notifications
 * @apiName Get unreads
 * @apiVersion 2.0.0
 * @apiDescription get unread notifications
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.ref_id
 * @apiSuccess (200) {String} items.type ('FOLLOWED', 'COMMENT_LIKE', 'POST_LIKE', 'CHAT', 'SHARE_POST', 'SHARE_PROJECT', 'COMMENT', 'APPLICATION')
 * @apiSuccess (200) {Object} items.data
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 * @apiSuccess (200) {Datetime} items.read_at
 * @apiSuccess (200) {Datetime} items.view_at
 */
router.get('/unreads', loginRequired, paginate, async (ctx) => {
  const notifications = await Notif.allUnreads(ctx.user.id, ctx.paginate);

  await Notif.viewed(
    ctx.user.id,
    notifications.map((n) => n.id),
  );

  ctx.body = notifications;
});

/**
 * @api {get} /notifications/:id Get
 * @apiGroup notifications
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription get notification
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} ref_id
 * @apiSuccess (200) {String} type ('FOLLOWED', 'COMMENT_LIKE', 'POST_LIKE', 'CHAT', 'SHARE_POST', 'SHARE_PROJECT', 'COMMENT', 'APPLICATION')
 * @apiSuccess (200) {Object} data
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {Datetime} read_at
 * @apiSuccess (200) {Datetime} view_at
 */
router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  const notif = await Notif.get(ctx.user.id, ctx.params.id);
  await Notif.read(ctx.user.id, [ctx.params.id]);
  ctx.body = notif;
});

/**
 * @api {get} /notifications Get all
 * @apiGroup notifications
 * @apiName Get all
 * @apiVersion 2.0.0
 * @apiDescription get notifications
 *
 * @apiQuery {Boolean} unreads default false filter only unread messages
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.ref_id
 * @apiSuccess (200) {String} items.type ('FOLLOWED', 'COMMENT_LIKE', 'POST_LIKE', 'CHAT', 'SHARE_POST', 'SHARE_PROJECT', 'COMMENT', 'APPLICATION')
 * @apiSuccess (200) {Object} items.data
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 * @apiSuccess (200) {Datetime} items.read_at
 * @apiSuccess (200) {Datetime} items.view_at
 */
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

/**
 * @api {post} /notifications/read/all read all notifications
 * @apiGroup notifications
 * @apiName readAll
 * @apiVersion 2.0.0
 * @apiDescription read all notifications
 *
 */
router.post('/read/all', loginRequired, async (ctx) => {
  await Notif.readAll(ctx.user.id);
  ctx.body = {message: 'success'};
});

/**
 * @api {post} /notifications/read/:id Read
 * @apiGroup notifications
 * @apiName Read
 * @apiVersion 2.0.0
 * @apiDescription read notification
 *
 * @apiParam {String} id
 *
 */
router.post('/read/:id', loginRequired, checkIdParams, async (ctx) => {
  await Notif.read(ctx.user.id, [ctx.params.id]);
  ctx.body = {message: 'success'};
});
