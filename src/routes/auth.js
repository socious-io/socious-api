import Router from '@koa/router';
import Debug from 'debug';
import Auth from '../services/auth/index.js';

export const router = new Router();

const debug = Debug('socious-api:auth');

/**
 * @api {post} /auth/login Login
 * @apiGroup Auth
 * @apiName Login
 * @apiVersion 2.0.0
 * @apiDescription Basic Auth
 *
 * @apiBody {String} email Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess (200) {Object} access_token
 */
router.post('/login', async (ctx) => {
  ctx.body = await Auth.basic(ctx.request.body);
});

/**
 * @api {get} /auth/refresh Refresh Token
 * @apiGroup Auth
 * @apiName Refresh
 * @apiVersion 2.0.0
 * @apiDescription Refresh jwt token would expire current refresh token
 *
 * @apiHeader {string} RefreshToken
 *
 * @apiSuccess (200) {Object} access_token
 */
router.get('/refresh', async (ctx) => {
  const {refreshtoken} = ctx.request.header;
  ctx.body = await Auth.refreshToken(refreshtoken);
});

/**
 * @api {delete} /auth/logout Logout
 * @apiGroup Auth
 * @apiName Logout
 * @apiVersion 2.0.0
 * @apiDescription expire the refresh token
 *
 * @apiHeader {string} RefreshToken
 *
 */
router.delete('/logout', async (ctx) => {
  const {refreshtoken} = ctx.request.header;
  await Auth.expireRefreshToken(refreshtoken);
  ctx.body = {message: 'success'};
});

/**
 * @api {post} /auth/web/login Login with session
 * @apiGroup Auth
 * @apiName Login with session
 * @apiVersion 2.0.0
 * @apiDescription Basic Auth with set cookie
 *
 * @apiBody {String} email Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess (200) {Object} access_token
 */
router.post('/web/login', async (ctx) => {
  const response = await Auth.basic(ctx.request.body);
  ctx.session.token = response.access_token;
  ctx.body = {message: 'success'};
});

/**
 * @api {post} /auth/register Register
 * @apiGroup Auth
 * @apiName Register
 * @apiVersion 2.0.0
 * @apiDescription Registeration
 *
 * @apiBody {String} first_name Mandatory
 * @apiBody {String} last_name Mandatory
 * @apiBody {String{min:6 max:20}} username Mandatory
 * @apiBody {String} email Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess (200) {Object} access_token
 */
router.post('/register', async (ctx) => {
  ctx.body = await Auth.register(ctx.request.body);
});

/**
 * @api {post} /auth/otp Send OTP
 * @apiGroup Auth
 * @apiName Send OTP
 * @apiVersion 2.0.0
 * @apiDescription sending otp to user email or phone
 *
 * @apiBody {String} email Mandatory if phone is empty
 * @apiBody {String} phone Mandatory if email is empty
 *
 * @apiSuccess (200) {Object} success
 *
 */
router.post('/otp', async (ctx) => {
  await Auth.sendOTP(ctx.request.body);
  ctx.body = {message: 'success'};
});

/**
 * @api {get} /auth/otp/confirm Confirm OTP
 * @apiGroup Auth
 * @apiName Confirm OTP
 * @apiVersion 2.0.0
 * @apiDescription confirm otp with code
 *
 * @apiQuery {Number} code
 * @apiQuery {String} email Mandatory if phone is empty
 * @apiQuery {String} phone Mandatory if email is empty
 *
 * @apiSuccess (200) {Object} access_token
 *
 */
router.get('/otp/confirm', async (ctx) => {
  ctx.body = await Auth.confirmOTP({
    code: ctx.query.code,
    email: ctx.query.email,
    phone: ctx.query.phone,
  });
});

/**
 * @api {get} /auth/otp/confirm/web Confirm OTP Web
 * @apiGroup Auth
 * @apiName Confirm OTP Web
 * @apiVersion 2.0.0
 * @apiDescription confirm otp with code and create session
 *
 * @apiQuery {Number} code
 * @apiQuery {String} email Mandatory if phone is empty
 * @apiQuery {String} phone Mandatory if email is empty
 *
 */
router.get('/otp/confirm/web', async (ctx) => {
  const response = await Auth.confirmOTP({
    code: ctx.query.code,
    email: ctx.query.email,
    phone: ctx.query.phone,
  });

  ctx.session.token = response.access_token;
  ctx.body = {message: 'success'};
});

/**
 * @api {post} /auth/forget-password Forget Password
 * @apiGroup Auth
 * @apiName Forget Password
 * @apiVersion 2.0.0
 * @apiDescription sending otp to user email or phone with expire current password
 *
 * @apiBody {String} email Mandatory if phone is empty
 * @apiBody {String} phone Mandatory if email is empty
 *
 * @apiSuccess (200) {Object} success
 *
 */
router.post('/forget-password', async (ctx) => {
  await Auth.forgetPassword(ctx.request.body);
  ctx.body = {message: 'success'};
});

/**
 * @api {post} /auth/preregister Check Email or Username
 * @apiGroup Auth
 * @apiName Check Email or Username
 * @apiVersion 2.0.0
 * @apiDescription check if email or username is valid and if already registered
 *
 * @apiBody {String} email Mandatory if username is empty
 * @apiBody {String} username Mandatory if email is empty
 *
 * @apiSuccess (200) {String} username Null if ok, 'EXISTS' if already registered, or validation error message
 * @apiSuccess (200) {String} email Null if ok, 'EXISTS' if already registered, or validation error message
 *
 */
router.post('/preregister', async (ctx) => {
  ctx.body = await Auth.preregister(ctx.request.body);
});
