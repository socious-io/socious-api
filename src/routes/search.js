import Router from '@koa/router';
import Search from '../services/search/index.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {paginate} from '../utils/requests.js';

export const router = new Router();

/**
 * @api {post} /search Search
 * @apiGroup Search
 * @apiName Search
 * @apiVersion 2.0.0
 * @apiDescription search
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1, max:50}} limit default 10
 *
 * @apiBody {String} q query string
 * @apiBody {String} type query type (posts, users, related_users(follwed or following), projects, chats)
 * @apiBody {Object} filter
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 */
router.post('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Search.find(
    ctx.request.body,
    {userId: ctx.user.id, identityId: ctx.identity.id, shouldSave: !ctx.guest},
    ctx.paginate,
  );
});

/**
 * @api {get} /search/history History
 * @apiGroup Search
 * @apiName History
 * @apiVersion 2.0.0
 * @apiDescription search history
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1, max:50}} limit default 10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 */
router.get('/history', loginRequired, paginate, async (ctx) => {
  ctx.body = await Search.history(ctx.identity.id, ctx.paginate);
});
