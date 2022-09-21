import Router from '@koa/router';
import {loginRequired} from '../utils/middlewares/authorization.js';
import Device from '../models/device/index.js';
import {validate} from '@socious/data';

export const router = new Router();

/**
 * @api {get} /devices Get
 * @apiGroup Device
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription get current user devices
 *
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} user_id
 * @apiSuccess (200) {String} token
 * @apiSuccess (200) {Object} meta
 * @apiSuccess (200) {String} created_at
 */
router.get('/', loginRequired, async (ctx) => {
  ctx.body = await Device.all(ctx.user.id);
});

/**
 * @api {post} /devices Add
 * @apiGroup Device
 * @apiName Add
 * @apiVersion 2.0.0
 * @apiDescription add device to current user
 *
 * @apiBody {String} token
 * @apiBody {Object} meta
 * @apiBody {String} meta.app_version
 * @apiBody {String} meta.os ('IOS', 'ANDROID', 'WINDOWS', 'WEBAPP')
 * @apiBody {String} meta.os_version
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} user_id
 * @apiSuccess (200) {String} token
 * @apiSuccess (200) {Object} meta
 * @apiSuccess (200) {String} created_at
 */
router.post('/', loginRequired, async (ctx) => {
  await validate.DeviceNewSchema.validateAsync(ctx.request.body);
  ctx.body = await Device.insert(ctx.user.id, ctx.request.body);
});

/**
 * @api {post} /devices/update Update
 * @apiGroup Device
 * @apiName Update
 * @apiVersion 2.0.0
 * @apiDescription update current user token meta
 *
 * @apiBody {String} token
 * @apiBody {Object} meta
 * @apiBody {String} meta.app_version
 * @apiBody {String} meta.os ('IOS', 'ANDROID', 'WINDOWS', 'WEBAPP')
 * @apiBody {String} meta.os_version
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} user_id
 * @apiSuccess (200) {String} token
 * @apiSuccess (200) {Object} meta
 * @apiSuccess (200) {String} created_at
 */
router.post('/update', loginRequired, async (ctx) => {
  await validate.DeviceNewSchema.validateAsync(ctx.request.body);
  ctx.body = await Device.update(ctx.user.id, ctx.request.body);
});

/**
 * @api {post} /devices/remove/:token Delete
 * @apiGroup Device
 * @apiName DElete
 * @apiVersion 2.0.0
 * @apiDescription delete current user token
 *
 * @apiParam {String} token
 *
 */
router.post('/remove/:token', loginRequired, async (ctx) => {
  await Device.delete(ctx.user.id, ctx.params.token);
  ctx.body = {message: 'success'};
});
