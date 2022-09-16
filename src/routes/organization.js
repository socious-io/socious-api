import Router from '@koa/router';
import Org from '../models/organization/index.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {paginate} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /orgs/:id Get
 * @apiGroup Organazation
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription get organazation
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} name
 * @apiSuccess (200) {String} bio
 * @apiSuccess (200) {String} description
 * @apiSuccess (200) {String} email
 * @apiSuccess (200) {String} phone
 * @apiSuccess (200) {String} type
 * @apiSuccess (200) {String} city
 * @apiSuccess (200) {String} address
 * @apiSuccess (200) {Url} website
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String[]} social_causes
 */
router.get('/:id', loginOptional, async (ctx) => {
  ctx.body = await Org.get(ctx.params.id);
});

/**
 * @api {get} /orgs/by-shortname/:shortname Get By shortname
 * @apiGroup Organazation
 * @apiName Get By shortname
 * @apiVersion 2.0.0
 * @apiDescription get organazation by shortname
 *
 * @apiParam {String} shortname
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} name
 * @apiSuccess (200) {String} bio
 * @apiSuccess (200) {String} description
 * @apiSuccess (200) {String} email
 * @apiSuccess (200) {String} phone
 * @apiSuccess (200) {String} type
 * @apiSuccess (200) {String} city
 * @apiSuccess (200) {String} address
 * @apiSuccess (200) {Url} website
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String[]} social_causes
 */
router.get('/by-shortname/:shortname', loginOptional, async (ctx) => {
  ctx.body = await Org.getByShortname(ctx.params.shortname);
});

/**
 * @api {get} /orgs Get all
 * @apiGroup Organazation
 * @apiName Get all
 * @apiVersion 2.0.0
 * @apiDescription get organazations
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.name
 * @apiSuccess (200) {String} items.bio
 * @apiSuccess (200) {String} items.description
 * @apiSuccess (200) {String} items.email
 * @apiSuccess (200) {String} items.phone
 * @apiSuccess (200) {String} items.type
 * @apiSuccess (200) {String} items.city
 * @apiSuccess (200) {String} items.address
 * @apiSuccess (200) {String} items.website
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 * @apiSuccess (200) {String[]} items.social_causes
 */
router.get('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Org.all(ctx.paginate);
});

/**
 * @api {post} /orgs Create new
 * @apiGroup Organazation
 * @apiName Create new
 * @apiVersion 2.0.0
 * @apiDescription create new organazation
 *
 * @apiBody {String} shortname Mandatory Unique
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
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} name
 * @apiSuccess (200) {String} bio
 * @apiSuccess (200) {String} description
 * @apiSuccess (200) {String} email
 * @apiSuccess (200) {String} phone
 * @apiSuccess (200) {String} type
 * @apiSuccess (200) {String} city
 * @apiSuccess (200) {String} address
 * @apiSuccess (200) {Url} website
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String[]} social_causes
 */
router.post('/', loginRequired, async (ctx) => {
  ctx.body = await Org.insert(ctx.user.id, ctx.request.body);
  await Org.addMember(ctx.body.id, ctx.user.id);
});

/**
 * @api {get} /orgs/check Check uniques
 * @apiGroup Organazation
 * @apiName Check uniques
 * @apiVersion 2.0.0
 * @apiDescription check organazation unique columns
 *
 * @apiQuery {String} shortname
 */

router.get('/check', loginRequired, async (ctx) => {
  ctx.body = {
    shortname_exists: await Org.shortNameExists(ctx.query.shortname),
  };
});

/**
 * @api {post} /orgs/:id Update
 * @apiGroup Organazation
 * @apiName Update
 * @apiVersion 2.0.0
 * @apiDescription update organazation
 *
 * @apiParam {String} id
 *
 * @apiBody {String} shortname Mandatory Unique
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
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} name
 * @apiSuccess (200) {String} bio
 * @apiSuccess (200) {String} description
 * @apiSuccess (200) {String} email
 * @apiSuccess (200) {String} phone
 * @apiSuccess (200) {String} type
 * @apiSuccess (200) {String} city
 * @apiSuccess (200) {String} address
 * @apiSuccess (200) {Url} website
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String[]} social_causes
 */
router.post('/update/:id', loginRequired, async (ctx) => {
  await Org.permissionedMember(ctx.params.id, ctx.user.id);
  ctx.body = await Org.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {post} /orgs/:id/members add member
 * @apiGroup Organazation.Members
 * @apiName Update
 * @apiVersion 2.0.0
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
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.username
 * @apiSuccess (200) {String} items.first_name
 * @apiSuccess (200) {String} items.last_name
 * @apiSuccess (200) {String} items.email
 */
router.get('/:id/members', loginRequired, paginate, async (ctx) => {
  ctx.body = await Org.members(ctx.params.id, ctx.paginate);
});

/**
 * @api {post} /orgs/:id/members/:user_id Add member
 * @apiGroup Organazation.Members
 * @apiName Add member
 * @apiVersion 2.0.0
 * @apiDescription update organazation
 *
 * @apiParam {String} id
 * @apiParam {String} user_id
 *
 * @apiSuccess (200) {Object} success
 *
 */
router.post('/:id/members/:user_id', loginRequired, async (ctx) => {
  await Org.permissionedMember(ctx.params.id, ctx.user.id);
  await Org.addMember(ctx.params.id, ctx.params.user_id);
  ctx.body = {message: 'success'};
});

/**
 * @api {get} /orgs/remove/:id/members/:user_id Delete member
 * @apiGroup Organazation.Members
 * @apiName Delete member
 * @apiVersion 2.0.0
 * @apiDescription update organazation
 *
 * @apiParam {String} id
 * @apiParam {String} user_id
 *
 * @apiSuccess (200) {Object} success
 *
 */
router.get('/remove/:id/members/:user_id', loginRequired, async (ctx) => {
  await Org.permissionedMember(ctx.params.id, ctx.user.id);
  await Org.removeMember(ctx.params.id, ctx.params.user_id);
  ctx.body = {message: 'success'};
});
