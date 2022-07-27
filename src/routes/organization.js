import Router from '@koa/router';
import Org from '../models/organization/index.js';
import {paginate} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /org/:id Get
 * @apiGroup Organazation
 * @apiName Get
 * @apiVersion 1.0.0
 * @apiDescription get organazation
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
  ctx.body = await Org.get(ctx.params.id);
});

/**
 * @api {get} /org Get all
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
  ctx.body = await Org.all(ctx.paginate);
});

/**
 * @api {post} /org Create new
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
router.post('/', async (ctx) => {
  ctx.body = await Org.insert(ctx.request.body);
});

/**
 * @api {post} /org/:id Update
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
router.put('/:id', async (ctx) => {
  ctx.body = await Org.update(ctx.params.id, ctx.request.body);
});
