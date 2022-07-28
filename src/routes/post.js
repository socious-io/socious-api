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
 * @apiSuccess {String} name
 * @apiSuccess {String} bio
 * @apiSuccess {String} description
 * @apiSuccess {String} email
 * @apiSuccess {String} phone
 * @apiSuccess {String} type
 * @apiSuccess {String} city
 * @apiSuccess {String} address
 * @apiSuccess {Url} website
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.get('/:id', async (ctx) => {
  ctx.body = await Post.get(ctx.params.id);
});

/**
 * @api {get} /orgs Get all
 * @apiGroup Organazation
 * @apiName Get all
 * @apiVersion 1.0.0
 * @apiDescription get organazations
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1, max:50}} limit default 10
 *
 * @apiSuccess {Number} page
 * @apiSuccess {Number} limit
 * @apiSuccess {Number} total_count
 * @apiSuccess {Object[]} items
 * @apiSuccess {String} items.name
 * @apiSuccess {String} items.bio
 * @apiSuccess {String} items.description
 * @apiSuccess {String} items.email
 * @apiSuccess {String} items.phone
 * @apiSuccess {String} items.type
 * @apiSuccess {String} items.city
 * @apiSuccess {String} items.address
 * @apiSuccess {String} items.website
 * @apiSuccess {Datetime} items.created_at
 * @apiSuccess {Datetime} items.updated_at
 */
router.get('/', paginate, async (ctx) => {
  ctx.body = await Post.all(ctx.paginate);
});

/**
 * @api {post} /orgs Create new
 * @apiGroup Organazation
 * @apiName Create new
 * @apiVersion 1.0.0
 * @apiDescription create new organazation
 *
 * @apiBody {String} name Mandatory
 * @apiBody {String} bio
 * @apiBody {String} description
 * @apiBody {String} email Mandatory
 * @apiBody {String} phone
 * @apiBody {Enum} type (SOCIAL, NONPROFIT, COOP, IIF, PUBLIC, INTERGOV, DEPARTMENT, OTHER)
 * @apiBody {String} city
 * @apiBody {String} address
 * @apiBody {Url} website
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} name
 * @apiSuccess {String} bio
 * @apiSuccess {String} description
 * @apiSuccess {String} email
 * @apiSuccess {String} phone
 * @apiSuccess {String} type
 * @apiSuccess {String} city
 * @apiSuccess {String} address
 * @apiSuccess {Url} website
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.post('/', identity, async (ctx) => {
  ctx.body = await Post.insert(ctx.identity.id, ctx.request.body);
});

/**
 * @api {post} /orgs/:id Update
 * @apiGroup Organazation
 * @apiName Update
 * @apiVersion 1.0.0
 * @apiDescription update organazation
 *
 * @apiParam {String} id
 *
 * @apiBody {String} name
 * @apiBody {String} bio
 * @apiBody {String} description
 * @apiBody {String} email
 * @apiBody {String} phone
 * @apiBody {Enum} type (SOCIAL, NONPROFIT, COOP, IIF, PUBLIC, INTERGOV, DEPARTMENT, OTHER)
 * @apiBody {String} city
 * @apiBody {String} address
 * @apiBody {Url} website
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} name
 * @apiSuccess {String} bio
 * @apiSuccess {String} description
 * @apiSuccess {String} email
 * @apiSuccess {String} phone
 * @apiSuccess {String} type
 * @apiSuccess {String} city
 * @apiSuccess {String} address
 * @apiSuccess {Url} website
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.put('/:id', identity, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Post.update(ctx.params.id, ctx.request.body);
});

router.delete('/:id', identity, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id);
  await Post.remove(ctx.params.id);
  ctx.body = {message: 'success'};
});
