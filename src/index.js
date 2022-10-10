import Koa from 'koa';
import http from 'http';
import morgan from 'koa-morgan';
import pg from 'pg';
import {DBCircuitBreaker} from './utils/circuitbreaker.js';
import socket from './utils/socket.js';
import blueprint from './routes/index.js';

import middlewares from './utils/middlewares/site.js';
import {koaLogger} from './utils/logging.js';
import Config from './config.js';

export const app = new Koa({proxy: true});

app.keys = [Config.secret];
app.users = {};
app.use(koaLogger);

app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]', {
    skip(req, _) {
      return /^\/ping/.exec(req.url);
    },
  }),
);
app.silent = true;
// configure the database via environment, see:
// https://www.postgresql.org/docs/9.1/libpq-envars.html
app.db = new DBCircuitBreaker(new pg.Pool());
app.db.pool.on('error', (err) => {
  console.error('Unexpected database error on idle client', err);
  process.exit(-1);
});

app.use(middlewares(app));

blueprint(app);
socket(app);

app.http = http.createServer(app.callback());

app.listen = app.listen = (...args) => {
  app.http.listen.call(app.http, ...args);
  return app.http;
};
