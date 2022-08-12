import Router from '@koa/router';
import Debug from 'debug';
import User from '../models/user/index.js';
import Applicant from '../models/applicant/index.js';
import Auth from '../services/auth/index.js';
import {paginate} from '../utils/requests.js';

export const router = new Router();

const debug = Debug('socious-api:user');

/**
 * @api {get} /user/:id/profile Others Profile
 * @apiGroup User
 * @apiName OthersProfile
 * @apiVersion 2.0.0
 * @apiDescription Other User Profile
 * @apiPermission LoginRequired
 *
 * @apiParam {String} id
 *
 * @apiBody (200) {String} first_name Mandatory
 * @apiBody (200) {String} last_name Mandatory
 * @apiBody (200) {String} bio
 * @apiBody (200) {String} city
 * @apiBody (200) {String} address
 * @apiBody (200) {String} wallet_address
 * @apiBody (200) {String[]} social_causes
 */
router.get('/:id/profile', async (ctx) => {
  const user = await User.get(ctx.params.id);
  ctx.body = await User.profile(user);
});

/**
 * @api {get} /user/profile Profile
 * @apiGroup User
 * @apiName Profile
 * @apiVersion 2.0.0
 * @apiDescription Current User Profile
 * @apiPermission LoginRequired
 *
 * @apiBody (200) {String} first_name Mandatory
 * @apiBody (200) {String} last_name Mandatory
 * @apiBody (200) {String} bio
 * @apiBody (200) {String} city
 * @apiBody (200) {String} address
 * @apiBody (200) {String} wallet_address
 * @apiBody (200) {String[]} social_causes
 *
 */
router.get('/profile', async (ctx) => {
  ctx.body = await User.profile(ctx.user);
});

/**
 * @api {put} /user/profile Update Profile
 * @apiGroup User
 * @apiName UpdateProfile
 * @apiVersion 2.0.0
 * @apiDescription Update Current User Profile
 * @apiPermission LoginRequired
 *
 * @apiBody (200) {String} first_name Mandatory
 * @apiBody (200) {String} last_name Mandatory
 * @apiBody (200) {String} bio
 * @apiBody (200) {String} city
 * @apiBody (200) {String} address
 * @apiBody (200) {String} wallet_address
 * @apiBody (200) {String[]} social_causes
 */
router.put('/profile', async (ctx) => {
  ctx.body = await User.updateProfile(ctx.user.id, ctx.request.body);
});

/**
 * @api {put} /user/change-password Change Password
 * @apiGroup User
 * @apiName ChangePassword
 * @apiVersion 2.0.0
 * @apiDescription Change user password with user current password
 * @apiPermission LoginRequired
 *
 * @apiBody {String{min:8}} current_password Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess (200) {Object} success
 */
router.put('/change-password', async (ctx) => {
  await Auth.changePassword(ctx.user, ctx.request.body);
  ctx.body = {message: 'success'};
});

/**
 * @api {put} /user/change-password/direct Change Password Directly
 * @apiGroup User
 * @apiName ChangePasswordDirectly
 * @apiVersion 2.0.0
 * @apiDescription Change user password whithout current password (available only on forget password request)
 * @apiPermission LoginRequired
 *
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess (200) {Object} success
 */
router.put('/change-password-direct', async (ctx) => {
  await Auth.directChangePassword(ctx.user, ctx.request.body);

  ctx.body = {message: 'success'};
});

/**
 * @api {post} /user/delete Delete current user
 * @apiGroup User
 * @apiName DeleteCurrentUser
 * @apiVersion 2.0.0
 * @apiDescription delete current user
 * @apiPermission LoginRequired
 *
 * @apiBody {String} reason
 *
 * @apiSuccess (200) {Object} success
 */
router.post('/delete', async (ctx) => {
  await User.remove(ctx.user, ctx.request.body.reason);
  ctx.body = {message: 'success'};
});

/**
 * @api {get} /user/:id/applicants set session
 * @apiGroup User
 * @apiName GetByUserId
 * @apiVersion 1.0.0
 * @apiDescription get applicants by user id
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} project_id
 * @apiSuccess {String} user_id
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.get('/:id/applicants', paginate, async (ctx) => {
  ctx.body = await Applicant.getByUserId(ctx.params.id, ctx.paginate);
});
