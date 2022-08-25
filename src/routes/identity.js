import Router from '@koa/router';
import Identity from '../models/identity/index.js';
import {identity} from '../utils/requests.js';

export const router = new Router();

/**
 * @api {get} /identities Get Allowed
 * @apiGroup Identity
 * @apiName Allowed
 * @apiVersion 2.0.0
 * @apiDescription get all identities the current authentication can access
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {Object} type (users, organizations)
 * @apiSuccess (200) {Object} meta
 */
router.get('/', identity, async (ctx) => {
  ctx.body = await Identity.getAll(ctx.user.id, ctx.identity.id);
});

/**
 * @api {get} /identities/:id Get
 * @apiGroup Identity
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription get identity
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
 * @api {get} /identities/:id/session set session
 * @apiGroup Identity
 * @apiName Set Session
 * @apiVersion 2.0.0
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
