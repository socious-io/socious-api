import Koa from 'koa';
import jwt from 'koa-jwt';
import Router from '@koa/router';
import morgan from 'koa-morgan';
import koaBody from 'koa-body';
import pg from 'pg';

import {DBCircuitBreaker} from './utils/circuitbreaker.js';

import {router as ping} from './routes/ping.js';
import {router as auth} from './routes/auth.js';
import {router as user} from './routes/user.js';
import middlewares from './utils/middlewares.js';
import Config from './config.js';
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

app.use(middlewares);

app.use(jwt({secret: Config.secret}).unless({path: [/^\/auth/, /^\/ping/]}));

const blueprint = new Router();
blueprint.use('/ping', ping.routes(), ping.allowedMethods());
blueprint.use('/auth', auth.routes(), auth.allowedMethods());
blueprint.use('/api/user', user.routes(), user.allowedMethods());

app.use(blueprint.routes());
app.use(blueprint.allowedMethods());
