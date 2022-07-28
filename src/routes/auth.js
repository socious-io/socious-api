import Router from '@koa/router';
import Debug from 'debug';
import Auth from '../services/auth/index.js';

export const router = new Router();

const debug = Debug('socious-api:auth');

/**
 * @api {post} /auth/login Login
 * @apiGroup Auth
 * @apiName Login
 * @apiVersion 1.0.0
 * @apiDescription Basic Auth
 *
 * @apiBody {String} email Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess {String} access_token
 */
router.post('/login', async (ctx) => {
  ctx.body = await Auth.basic(ctx.request.body);
});

/**
 * @api {post} /auth/web/login Login with session
 * @apiGroup Auth
 * @apiName Login with session
 * @apiVersion 1.0.0
 * @apiDescription Basic Auth with set cookie
 *
 * @apiBody {String} email Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess {String} access_token
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
 * @apiVersion 1.0.0
 * @apiDescription Registeration
 *
 * @apiBody {String} first_name Mandatory
 * @apiBody {String} last_name Mandatory
 * @apiBody {String{min:6 max:20}} username Mandatory
 * @apiBody {String} email Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess {String} access_token
 */
router.post('/register', async (ctx) => {
  ctx.body = await Auth.register(ctx.request.body);
});

/**
 * @api {post} /auth/otp Send OTP
 * @apiGroup Auth
 * @apiName Send OTP
 * @apiVersion 1.0.0
 * @apiDescription sending otp to user email or phone
 *
 * @apiBody {String} email Mandatory if phone is empty
 * @apiBody {String} phone Mandatory if email is empty
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
 * @apiVersion 1.0.0
 * @apiDescription confirm otp with code
 *
 * @apiQuery {Number} code
 * @apiQuery {String} email Mandatory if phone is empty
 * @apiQuery {String} phone Mandatory if email is empty
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
 * @api {post} /auth/forget-password Forget Password
 * @apiGroup Auth
 * @apiName Forget Password
 * @apiVersion 1.0.0
 * @apiDescription sending otp to user email or phone with expire current password
 *
 * @apiBody {String} email Mandatory if phone is empty
 * @apiBody {String} phone Mandatory if email is empty
 *
 */
router.post('/forget-password', async (ctx) => {
  await Auth.forgetPassword(ctx.request.body);
  ctx.body = {message: 'success'};
});
