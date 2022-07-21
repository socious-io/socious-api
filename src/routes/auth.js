import Router from '@koa/router'
import Debug from 'debug';
import User from '../models/User/index.js'
import { BadRequestError } from '../utils/errors.js';
const debug = Debug('socious-api:auth');
export const router = new Router();


/**
 * @api {get} /auth/login Login
 * @apiGroup Auth
 * @apiName Login
 *
 * @apiDescription Basic Auth
 *
 */
 router.post('/login', async (ctx) => {
  const res = await User.get('test')
  if (!ctx.request.body.username) throw new BadRequestError('username required')
  ctx.body = res
});
