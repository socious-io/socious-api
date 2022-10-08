import compose from 'koa-compose';
import Cors from '@koa/cors';
import koaBody from 'koa-body';
import session from 'koa-session';
import Config from '../../config.js';

export const cors = new Cors({
  origin: Config.cors.origins.length
    ? (ctx) => {
        const origin = ctx.header.origin || ctx.origin;
        if (origin) {
          const url = new URL(origin);
          for (const allowed of Config.cors.origins) {
            if (url.host.endsWith(allowed)) return origin;
          }
        }
        return 'https://socious.io';
      }
    : undefined,
  credentials: true,
});

export const throwHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.debugMessage && Config.debug) {
      if (ctx.app.env === 'development') ctx.body.debug = err.debugMessage;
      console.log(`${err}: ${err.debugMessage}`);
    }
    ctx.body = {error: err.message};
    if (err.name === 'ValidationError') {
      ctx.status = 400;
      return;
    }

    if (err.message.includes('uuid')) err.status = 400;

    ctx.status = err.status || 500;
  }
};

export default (app) =>
  compose([throwHandler, cors, koaBody(), session(Config.session, app)]);
