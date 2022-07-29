import Router from '@koa/router';
import Post from '../models/post/index.js';
import {paginate, identity} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /posts/:id Get
 * @apiGroup Post
 * @apiName Get
 * @apiVersion 1.0.0
 * @apiDescription get post
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} content
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 * @apiSuccess {String} identity_id
 * @apiSuccess {String} identity_type
 * @apiSuccess {Object} identity_meta
 * @apiSuccess {String[]} hashtags
 * @apiSuccess {String[]} causes_tags
 * @apiSuccess {String[]} identity_tags
 */
router.get('/:id', async (ctx) => {
  ctx.body = await Post.get(ctx.params.id);
});

/**
 * @api {get} /posts Get all
 * @apiGroup Post
 * @apiName Get all
 * @apiVersion 1.0.0
 * @apiDescription get posts
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1, max:50}} limit default 10
 *
 * @apiSuccess {Number} page
 * @apiSuccess {Number} limit
 * @apiSuccess {Number} total_count
 * @apiSuccess {Object[]} items
 * @apiSuccess {String} items.id
 * @apiSuccess {String} items.content
 * @apiSuccess {Datetime} items.created_at
 * @apiSuccess {Datetime} items.updated_at
 * @apiSuccess {String} items.identity_id
 * @apiSuccess {String} items.identity_type
 * @apiSuccess {Object} items.identity_meta
 * @apiSuccess {String[]} items.hashtags
 * @apiSuccess {String[]} items.causes_tags
 * @apiSuccess {String[]} items.identity_tags
 */
router.get('/', paginate, async (ctx) => {
  ctx.body = await Post.all(ctx.paginate);
});

/**
 * @api {post} /posts Create new
 * @apiGroup Post
 * @apiName Create
 * @apiVersion 1.0.0
 * @apiDescription create new post
 *
 * @apiBody {String} content
 * @apiBody {String[]} hashtags
 * @apiBody {String[]} causes_tags
 * @apiBody {String[]} identity_tags
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} content
 * @apiSuccess {String[]} hashtags
 * @apiSuccess {String[]} causes_tags
 * @apiSuccess {String[]} identity_tags
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 * @apiSuccess {String} identity_id
 */
router.post('/', identity, async (ctx) => {
  ctx.body = await Post.insert(ctx.identity.id, ctx.request.body);
});

/**
 * @api {put} /posts/:id Update
 * @apiGroup Post
 * @apiName Update
 * @apiVersion 1.0.0
 * @apiDescription update post
 *
 * @apiBody {String} content
 * @apiBody {String[]} hashtags
 * @apiBody {String[]} causes_tags
 * @apiBody {String[]} identity_tags
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} content
 * @apiSuccess {String[]} hashtags
 * @apiSuccess {String[]} causes_tags
 * @apiSuccess {String[]} identity_tags
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 * @apiSuccess {String} identity_id
 */
router.put('/:id', identity, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Post.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {delete} /posts/:id Delete
 * @apiGroup Post
 * @apiName Delete
 * @apiVersion 1.0.0
 * @apiDescription delete post
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 */
router.delete('/:id', identity, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id);
  await Post.remove(ctx.params.id);
  ctx.body = {message: 'success'};
});
