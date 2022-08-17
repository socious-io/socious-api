import Router from '@koa/router';
import Search from '../services/search/index.js';
import {paginate} from '../utils/requests.js';

export const router = new Router();


/**
 * @api {get} /search Search
 * @apiGroup Search
 * @apiName Search
 * @apiVersion 2.0.0
 * @apiDescription search
 *
 * @apiQuery {String} q query string
 * @apiQuery {String} type query type (posts, users, related_users(follwed or following), projects, chats)
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1, max:50}} limit default 10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 */
router.get('/', paginate, async (ctx) => {
  const body = {
    ...ctx.query,
    current_user_id: ctx.user.id,
  };
  ctx.body = await Search.find(body, ctx.paginate);
});
