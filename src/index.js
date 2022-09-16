import Koa from 'koa';
import http from 'http';
import morgan from 'koa-morgan';
import koaBody from 'koa-body';
import session from 'koa-session';
import pg from 'pg';

import {DBCircuitBreaker} from './utils/circuitbreaker.js';
import socket from './utils/socket.js';
import blueprint from './routes/index.js';

import middlewares from './utils/middlewares/site.js';

import Config from './config.js';

export const app = new Koa({proxy: true});

app.keys = [Config.secret];
app.users = {};

app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]', {
    skip(req, _) {
      return /^\/ping/.exec(req.url);
    },
  }),
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
app.use(session(Config.session, app));

blueprint(app);
socket(app);

app.http = http.createServer(app.callback());
app.listen = app.listen = (...args) => {
  app.http.listen.call(app.http, ...args);
  return app.http;
};
