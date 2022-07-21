import Router from '@koa/router';
import Debug from 'debug';
import User from '../models/User/index.js';

export const router = new Router();

const debug = Debug('socious-api:auth');

/**
 * @api {get} /auth/login Login
 * @apiGroup Auth
 * @apiName Login
 *
 * @apiDescription Basic Auth
 *
 */
router.post('/login', async (ctx) => {
  ctx.body = await User.auth(ctx.request.body);
});

/**
 * @api {get} /auth/register Register
 * @apiGroup Auth
 * @apiName Register
 *
 * @apiDescription Registeration
 *
 */
router.post('/register', async (ctx) => {
  ctx.body = await User.register(ctx.request.body);
});
