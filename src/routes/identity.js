import Router from '@koa/router';
import Identity from '../models/identity/index.js';
import {identity} from '../utils/requests.js';

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
 * @apiSuccess {String} id
 * @apiSuccess {String} type (users, organizations)
 * @apiSuccess {Object} meta
 */
router.get('/:id', async (ctx) => {
  ctx.body = await Identity.get(ctx.params.id);
});

/**
 * @api {get} /identities Get Current
 * @apiGroup Identity
 * @apiName Current
 * @apiVersion 1.0.0
 * @apiDescription get others identity
 *
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} type (users, organizations)
 * @apiSuccess {Object} meta
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
 */
router.get('/set/:id/session', identity, async (ctx) => {
  const identity = await Identity.get(ctx.params.id);
  await Identity.permissioned(identity, ctx.user.id);

  ctx.session.current_identity = identity.id;

  ctx.body = {message: 'success'};
});
