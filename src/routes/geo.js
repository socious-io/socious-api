import Router from '@koa/router';
import {geoip} from '../services/geo/geoip.js';

export const router = new Router();

router.get('/ip', async (ctx) => {
  ctx.body = await geoip(ctx.query.ip || ctx.request.ip);
});
