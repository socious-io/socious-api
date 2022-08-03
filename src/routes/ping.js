import Router from '@koa/router';
import axios from 'axios';
import Debug from 'debug';

import config from '../config.js';

const debug = Debug('socious-api:ping');
export const router = new Router();
let abort = false;

/**
 * @api {get} /ping Ping
 * @apiGroup Util
 * @apiName Ping
 * @apiVersion 1.0.0
 * @apiDescription Ping API to check if its alive.
 *
 * @apiSuccess (200) {String='pong'} pong
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *     pong
 */
router.get('/', (ctx) => {
  ctx.body = 'pong';
});

router.get('/remote', async (ctx) => {
  const pingRes = await axios.get(`http://localhost:${config.port}/ping`);
  ctx.body = pingRes.data;
});

/**
 * @api {get} /ping/ready Ping
 * @apiGroup Util
 * @apiName Ping
 * @apiVersion 1.0.0
 * @apiDescription Ping ready API to check if service is up or about to go down
 *
 * @apiSuccess (200) {String='pong'} pong
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *     pong
 */

router.get('/ready', (ctx) => {
  if (abort) {
    debug('not ready');
    ctx.status = 500;
    ctx.statusText = ctx.body = 'not ready';
  }
  ctx.body = 'pong';
});

/**
 * @api {get} /ping/abort Ping
 * @apiGroup Util
 * @apiName Ping
 * @apiVersion 1.0.0
 * @apiDescription Mark service as not ready, so kubernetes will take it out of LB
 *
 * @apiSuccess (200) {String='abort'} abort
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 500
 *
 *     abort
 */

router.get('/abort', (ctx) => {
  abort = true;
  debug('abort application');
  ctx.body = 'abort';
});
