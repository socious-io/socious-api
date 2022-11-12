import Router from '@koa/router';
import {geoip} from '../services/geo/geoip.js';
import {locationsByCountry} from '../services/geo/geoname.js';

export const router = new Router();

router.get('/ip', async (ctx) => {
  ctx.body = await geoip(ctx.query.ip || ctx.request.ip);
});

router.get('/locations/country/:countryCode', async (ctx) => {
  const {countryCode} = ctx.params;
  if (countryCode?.length !== 2 || countryCode === 'XW') {
    ctx.body = [];
  } else {
    ctx.body = await locationsByCountry(countryCode);
  }
});
