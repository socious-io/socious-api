import Router from '@koa/router';
import Post from '../models/post/index.js';
import {paginate, identity} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /posts/:id Get
 * @apiGroup Post
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription get post
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} identity_type
 * @apiSuccess (200) {Object} identity_meta
 * @apiSuccess (200) {String[]} hashtags
 * @apiSuccess (200) {String[]} causes_tags
 * @apiSuccess (200) {String[]} identity_tags
 */
router.get('/:id', async (ctx) => {
  ctx.body = await Post.get(ctx.params.id);
});

/**
 * @api {get} /posts Get all
 * @apiGroup Post
 * @apiName Get all
 * @apiVersion 2.0.0
 * @apiDescription get posts
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.content
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 * @apiSuccess (200) {String} items.identity_id
 * @apiSuccess (200) {String} items.identity_type
 * @apiSuccess (200) {Object} items.identity_meta
 * @apiSuccess (200) {String[]} items.hashtags
 * @apiSuccess (200) {String[]} items.causes_tags
 * @apiSuccess (200) {String[]} items.identity_tags
 */
router.get('/', paginate, async (ctx) => {
  ctx.body = await Post.all(ctx.paginate);
});

/**
 * @api {post} /posts Create new
 * @apiGroup Post
 * @apiName Create
 * @apiVersion 2.0.0
 * @apiDescription create new post
 *
 * @apiBody {String} content
 * @apiBody {String} image
 * @apiBody {String[]} hashtags
 * @apiBody {String[]} causes_tags
 * @apiBody {String[]} identity_tags
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {String[]} hashtags
 * @apiSuccess (200) {String[]} causes_tags
 * @apiSuccess (200) {String[]} identity_tags
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String} identity_id
 */
router.post('/', identity, async (ctx) => {
  ctx.body = await Post.insert(ctx.identity.id, ctx.request.body);
});

/**
 * @api {put} /posts/:id Update
 * @apiGroup Post
 * @apiName Update
 * @apiVersion 2.0.0
 * @apiDescription update post
 *
 * @apiBody {String} content
 * @apiBody {String[]} hashtags
 * @apiBody {String} image
 * @apiBody {String[]} causes_tags
 * @apiBody {String[]} identity_tags
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {String[]} hashtags
 * @apiSuccess (200) {String[]} causes_tags
 * @apiSuccess (200) {String[]} identity_tags
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String} identity_id
 */
router.put('/:id', identity, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Post.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {delete} /posts/:id Delete
 * @apiGroup Post
 * @apiName Delete
 * @apiVersion 2.0.0
 * @apiDescription delete post
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {Object} success
 */
router.delete('/:id', identity, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id);
  await Post.remove(ctx.params.id);
  ctx.body = {message: 'success'};
});
