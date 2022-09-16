import compose from 'koa-compose';
import Cors from '@koa/cors';
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
    if (err.debugMessage) {
      if (ctx.app.env === 'development') ctx.body.debug = err.debugMessage;
      console.log(`${err}: ${err.debugMessage}`);
    } else {
      console.log(err);
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

export default compose([cors, throwHandler]);
