import Router from '@koa/router';
import Debug from 'debug';
import User from '../models/user/index.js';
import Applicant from '../models/applicant/index.js';
import Auth from '../services/auth/index.js';
import Skill from '../models/skill/index.js';
import {paginate} from '../utils/requests.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {validate} from '@socious/data';
import {checkIdParams} from '../utils/middlewares/route.js';

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
 * @apiBody  {String} first_name Mandatory
 * @apiBody  {String} last_name Mandatory
 * @apiBody  {String} bio
 * @apiBody  {String} city
 * @apiBody  {String} address
 * @apiBody  {String} wallet_address
 * @apiBody  {String[]} social_causes
 */
router.get('/:id/profile', loginOptional, checkIdParams, async (ctx) => {
  if (ctx.user.status === User.StatusType.INACTIVE) {
    ctx.body = await User.getProfileLimited(ctx.params.id);
    return;
  }
  ctx.body = await User.getProfile(ctx.params.id);
});

/**
 * @api {get} /user/by-username/:username/profile Others Profile by Username
 * @apiGroup User
 * @apiName OthersProfilebyUsername
 * @apiVersion 2.0.0
 * @apiDescription Other User Profile by username
 * @apiPermission LoginRequired
 *
 * @apiParam {String} username
 *
 * @apiBody  {String} first_name Mandatory
 * @apiBody  {String} last_name Mandatory
 * @apiBody  {String} bio
 * @apiBody  {String} city
 * @apiBody  {String} address
 * @apiBody  {String} wallet_address
 * @apiBody  {String[]} social_causes
 */
router.get('/by-username/:username/profile', loginOptional, async (ctx) => {
  if (ctx.user.status === User.StatusType.INACTIVE) {
    ctx.body = await User.getProfileByUsernameLimited(ctx.params.username);
    return;
  }
  ctx.body = await User.getProfileByUsername(ctx.params.username);
});

/**
 * @api {get} /user/profile Profile
 * @apiGroup User
 * @apiName Profile
 * @apiVersion 2.0.0
 * @apiDescription Current User Profile
 * @apiPermission LoginRequired
 *
 * @apiBody  {String} first_name Mandatory
 * @apiBody  {String} last_name Mandatory
 * @apiBody  {String} bio
 * @apiBody  {String} city
 * @apiBody  {String} address
 * @apiBody  {String} wallet_address
 * @apiBody  {String[]} social_causes
 *
 */
router.get('/profile', loginRequired, async (ctx) => {
  ctx.body = await User.currentProfile(ctx.user);
});

/**
 * @api {post} /user/update/profile Update Profile
 * @apiGroup User
 * @apiName UpdateProfile
 * @apiVersion 2.0.0
 * @apiDescription Update Current User Profile
 * @apiPermission LoginRequired
 *
 * @apiBody  {String} first_name Mandatory
 * @apiBody  {String} last_name Mandatory
 * @apiBody  {String} bio
 * @apiBody  {String} city
 * @apiBody  {String} avatar media uuid
 * @apiBody  {String} cover_image media uuid
 * @apiBody  {String} address
 * @apiBody  {String} wallet_address
 * @apiBody  {String[]} social_causes
 * @apiBody  {String[]} skills skills names
 */
router.post('/update/profile', loginRequired, async (ctx) => {
  await validate.UpdateProfileSchema.validateAsync(ctx.request.body);
  const skills = await Skill.getAllByNames(ctx.request.body.skills);
  ctx.request.body.skills = skills.map((s) => s.name);
  ctx.body = await User.updateProfile(ctx.user.id, ctx.request.body);
});

/**
 * @api {post} /user/change-password Change Password
 * @apiGroup User
 * @apiName ChangePassword
 * @apiVersion 2.0.0
 * @apiDescription Change user password with user current password
 * @apiPermission LoginRequired
 *
 * @apiBody {String{min:8}} current_password Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 */
router.post('/change-password', loginRequired, async (ctx) => {
  await Auth.changePassword(ctx.user, ctx.request.body);
  ctx.body = {
    message: 'success',
  };
});

/**
 * @api {post} /user/change-password/direct Change Password Directly
 * @apiGroup User
 * @apiName ChangePasswordDirectly
 * @apiVersion 2.0.0
 * @apiDescription Change user password whithout current password (available only on forget password request)
 * @apiPermission LoginRequired
 *
 * @apiBody {String{min:8}} password Mandatory
 *
 */
router.post('/change-password-direct', loginRequired, async (ctx) => {
  await Auth.directChangePassword(ctx.user, ctx.request.body);

  ctx.body = {
    message: 'success',
  };
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
 * @apiSuccess  {Object} success
 */
router.post('/delete', loginRequired, async (ctx) => {
  await User.remove(ctx.user, ctx.request.body.reason);
  ctx.body = {
    message: 'success',
  };
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
router.get(
  '/:id/applicants',
  loginRequired,
  checkIdParams,
  paginate,
  async (ctx) => {
    ctx.body = await Applicant.getByUserId(ctx.params.id, ctx.paginate);
  },
);
