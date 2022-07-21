import Router from '@koa/router';
import Debug from 'debug';
import User from '../models/User/index.js';

export const router = new Router();

const debug = Debug('socious-api:user');

router.get('/profile', async (ctx) => {
  ctx.body = await User.profile(ctx.userId);
});
