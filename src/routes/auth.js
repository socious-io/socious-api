import Router from '@koa/router';
import Debug from 'debug';
import User from '../models/User/index.js';

export const router = new Router();

const debug = Debug('socious-api:auth');

/**
 * @api {post} /auth/login Login
 * @apiGroup Auth
 * @apiName Login
 * @apiVersion 1.0.0
 * @apiDescription Basic Auth
 *
 * @apiBody {String{min:6 max:20}} username Mandatory
 * @apiBody {String{min:8}} password Mandatory
 *
 * @apiSuccess {String} access_token
 */
router.post('/login', async (ctx) => {
  ctx.body = await User.auth(ctx.request.body);
});

/**
 * @api {post} /auth/register Register
 * @apiGroup Auth
 * @apiName Register
 * @apiVersion 1.0.0
 * @apiDescription Registeration
 *
 * @apiBody {String{min:6 max:20}} username Mandatory
 * @apiBody {String{min:8}} password Mandatory
 * @apiBody {String} email Mandatory
 *
 * @apiSuccess {String} access_token
 */
router.post('/register', async (ctx) => {
  ctx.body = await User.register(ctx.request.body);
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
  await User.sendOTP(ctx.request.body);
  ctx.body = {message: 'success'};
});

/**
 * @api {get} /auth/otp/:code Confirm OTP
 * @apiGroup Auth
 * @apiName Confirm OTP
 * @apiVersion 1.0.0
 * @apiDescription confirm otp with code
 *
 * @apiParam {Number} code
 *
 */
router.get('/otp/:code', async (ctx) => {
  ctx.body = await User.confirmOTP(ctx.params.code);
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
router.post('/forget-password', async (ctx) => {
  await User.forgetPassword(ctx.request.body);
  ctx.body = {message: 'success'};
});
