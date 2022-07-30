import Router from '@koa/router';
import Org from '../models/organization/index.js';
import {paginate} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /orgs/:id Get
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
 * @apiSuccess {String[]} social_causes
 */
router.get('/:id', async (ctx) => {
  ctx.body = await Org.get(ctx.params.id);
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
 * @apiSuccess {String[]} items.social_causes
 */
router.get('/', paginate, async (ctx) => {
  ctx.body = await Org.all(ctx.paginate);
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
 * @apiBody {String[]} social_causes
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
 * @apiSuccess {String[]} social_causes
 */
router.post('/', async (ctx) => {
  ctx.body = await Org.insert(ctx.request.body);
  await Org.addMember(ctx.body.id, ctx.user.id);
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
 * @apiBody {String[]} social_causes
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
 * @apiSuccess {String[]} social_causes
 */
router.put('/:id', async (ctx) => {
  await Org.permissionedMember(ctx.params.id, ctx.user.id);
  ctx.body = await Org.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {post} /orgs/:id/members add member
 * @apiGroup Organazation.Members
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
 * @apiSuccess {Number} page
 * @apiSuccess {Number} limit
 * @apiSuccess {Number} total_count
 * @apiSuccess {Object[]} items
 * @apiSuccess {String} items.id
 * @apiSuccess {String} items.username
 * @apiSuccess {String} items.first_name
 * @apiSuccess {String} items.last_name
 * @apiSuccess {String} items.email
 */
router.get('/:id/members', paginate, async (ctx) => {
  ctx.body = await Org.members(ctx.params.id, ctx.paginate);
});

/**
 * @api {put} /orgs/:id/members/:user_id Add member
 * @apiGroup Organazation.Members
 * @apiName Add member
 * @apiVersion 1.0.0
 * @apiDescription update organazation
 *
 * @apiParam {String} id
 * @apiParam {String} user_id
 *
 */
router.put('/:id/members/:user_id', async (ctx) => {
  await Org.permissionedMember(ctx.params.id, ctx.user.id);
  await Org.addMember(ctx.params.id, ctx.params.user_id);
  ctx.body = {message: 'success'};
});

/**
 * @api {delete} /orgs/:id/members/:user_id Delete member
 * @apiGroup Organazation.Members
 * @apiName Delete member
 * @apiVersion 1.0.0
 * @apiDescription update organazation
 *
 * @apiParam {String} id
 * @apiParam {String} user_id
 *
 */
router.delete('/:id/members/:user_id', async (ctx) => {
  await Org.permissionedMember(ctx.params.id, ctx.user.id);
  await Org.removeMember(ctx.params.id, ctx.params.user_id);
  ctx.body = {message: 'success'};
});
