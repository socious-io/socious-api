import Router from '@koa/router';
import axios from 'axios';
import Debug from 'debug';

const debug = Debug('socious-api:ping');
export const router = new Router();
let abort = false;

/**
 * @api {get} /ping Ping
 * @apiGroup Util
 * @apiName Ping
 *
 * @apiDescription Ping API to check if its alive.
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
  const pingRes = await axios.get('http://localhost:14444/ping');
  ctx.body = pingRes.data;
});

/**
 * @api {get} /ping/ready Ping
 * @apiGroup Util
 * @apiName Ping
 *
 * @apiDescription Ping ready API to check if service is up or about to go down
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
 *
 * @apiDescription Mark service as not ready, so kubernetes will take it out of LB
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
