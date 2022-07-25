import Router from '@koa/router';
import Debug from 'debug';
import User from '../models/User/index.js';

export const router = new Router();

const debug = Debug('socious-api:user');

/**
 * @api {get} /api/user/profile Profile
 * @apiGroup User
 * @apiName Profile
 * @apiVersion 1.0.0
 * @apiDescription Current User Profile
 * @apiPermission LoginRequired
 *
 */
router.get('/profile', async (ctx) => {
  ctx.body = await User.profile(ctx.userId);
});

/**
 * @api {put} /api/user/profile Update Profile
 * @apiGroup User
 * @apiName UpdateProfile
 * @apiVersion 1.0.0
 * @apiDescription Update Current User Profile
 * @apiPermission LoginRequired
 *
 * @apiBody {String} first_name Mandatory
 * @apiBody {String} last_name Mandatory
 * @apiBody {String} bio
 * @apiBody {String} city
 * @apiBody {String} address
 * @apiBody {String} wallet_address
 */
router.put('/profile', async (ctx) => {
  ctx.body = await User.updateProfile(ctx.userId, ctx.request.body);
});

/**
 * @api {put} /api/user/change-password Change Password
 * @apiGroup User
 * @apiName ChangePassword
 * @apiVersion 1.0.0
 * @apiDescription Change user password with user current password
 * @apiPermission LoginRequired
 *
 * @apiBody {String{min:8}} current_password Mandatory
 * @apiBody {String{min:8}} password Mandatory
 */
router.put('/change-password', async (ctx) => {
  await User.changePassword(ctx.userId, ctx.request.body);
  ctx.body = {message: 'success'};
});

/**
 * @api {put} /api/user/change-password/direct Change PAssword Directly
 * @apiGroup User
 * @apiName ChangePasswordDirectly
 * @apiVersion 1.0.0
 * @apiDescription Change user password whithout current password (available only on forget password request)
 * @apiPermission LoginRequired
 *
 * @apiBody {String{min:8}} password Mandatory
 */
router.put('/change-password-direct', async (ctx) => {
  await User.directChangePassword(ctx.userId, ctx.request.body);

  ctx.body = {message: 'success'};
});
