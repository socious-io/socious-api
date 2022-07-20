import Koa from 'koa';
import Router from '@koa/router';
import morgan from 'koa-morgan';
import koaBody from 'koa-body';
import pg from 'pg';

import {DBCircuitBreaker} from './circuitbreaker.js';

import {router as ping} from './routes/ping.js';

// FIXME
class AuthorizationError extends Error {}

export const app = new Koa();
app.use(
  morgan(
    ':method :url :req[X-SSO-ID] :req[X-SSO-AG] :status :response-time ms - :res[content-length]',
    {
      skip(req, _) {
        return /^\/ping/.exec(req.url);
      },
    },
  ),
);
app.use(koaBody());
// configure the database via environment, see:
// https://www.postgresql.org/docs/9.1/libpq-envars.html
app.db = new DBCircuitBreaker(new pg.Pool());
app.db.pool.on('error', (err) => {
  console.error('Unexpected database error on idle client', err);
  process.exit(-1);
});
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof AuthorizationError) {
      ctx.status = 403;
      ctx.body = {error: err.message};
      if (err.debugMessage) {
        if (ctx.app.env === 'development') ctx.body.debug = err.debugMessage;
        console.log(`${err}: ${err.debugMessage}`);
      } else {
        console.log(err);
      }
    } else throw err;
  }
});

const router = new Router();
router.use('/ping', ping.routes(), ping.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());
