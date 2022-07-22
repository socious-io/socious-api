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
