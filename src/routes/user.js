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
