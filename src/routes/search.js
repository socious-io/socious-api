import Router from '@koa/router';
import Search from '../services/search/index.js';
import {loginOptional} from '../utils/middlewares/authorization.js';
import {paginate} from '../utils/requests.js';

export const router = new Router();

/**
 * @api {get} /search Search
 * @apiGroup Search
 * @apiName Search
 * @apiVersion 2.0.0
 * @apiDescription search
 *
 * @apiBody {String} q query string
 * @apiBody {String} type query type (posts, users, related_users(follwed or following), projects, chats)
 * @apiBody {Number} page default 1
 * @apiBody {Number{min: 1, max:50}} limit default 10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 */
router.post('/', loginOptional, paginate, async (ctx) => {
  const body = {
    ...ctx.request.body,
    current_user_id: ctx.user.id,
  };
  ctx.body = await Search.find(body, ctx.paginate);
});
