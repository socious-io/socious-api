import Router from '@koa/router';
import Identity from '../models/identity/index.js';
import Applicant from '../models/applicant/index.js';
import {paginate, identity} from '../utils/requests.js';

export const router = new Router();

/**
 * @api {get} /identities/:id Get Others
 * @apiGroup Identity
 * @apiName GetOthers
 * @apiVersion 1.0.0
 * @apiDescription get others identity
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {Object} id
 * @apiSuccess (200) {Object} type (users, organizations)
 * @apiSuccess (200) {Object} meta
 */
router.get('/:id', async (ctx) => {
  ctx.body = await Identity.get(ctx.params.id);
});

/**
 * @api {post} /identities/batch Get Others Multi
 * @apiGroup Identity
 * @apiName GetOthersMulti
 * @apiVersion 1.0.0
 * @apiDescription get others identity multi
 *
 * @apiBody {String[]{max:10}} ids
 *
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.type (users, organizations)
 * @apiSuccess (200) {Object} items.meta
 */
router.post('/batch', async (ctx) => {
  ctx.body = {items: await Identity.getAll(ctx.request.body)};
});

/**
 * @api {get} /identities Get Current
 * @apiGroup Identity
 * @apiName Current
 * @apiVersion 1.0.0
 * @apiDescription get others identity
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {Object} type (users, organizations)
 * @apiSuccess (200) {Object} meta
 */
router.get('/', identity, async (ctx) => {
  ctx.body = ctx.identity;
});

/**
 * @api {get} /identities/:id/session set session
 * @apiGroup Identity
 * @apiName Set Session
 * @apiVersion 1.0.0
 * @apiDescription save session for identities usage
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {Object} success
 */
router.get('/set/:id/session', async (ctx) => {
  const identity = await Identity.get(ctx.params.id);
  await Identity.permissioned(identity, ctx.user.id);

  ctx.session.current_identity = identity.id;

  ctx.body = {message: 'success'};
});

/**
 * @api {get} /identities/:id/applicants set session
 * @apiGroup Identity
 * @apiName GetByUserId
 * @apiVersion 1.0.0
 * @apiDescription get applicants by user id
 *
 * @apiParam {String} id
 * 
 * @apiSuccess {String} id
 * @apiSuccess {String} project_id
 * @apiSuccess {String} user_id
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
 router.get('/:id/applicants', paginate, async (ctx) => {
  ctx.body = await Applicant.getByUserId(ctx.params.id, ctx.paginate);
});
