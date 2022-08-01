import Koa from 'koa';
import http from 'http';
import Router from '@koa/router';
import morgan from 'koa-morgan';
import koaBody from 'koa-body';
import session from 'koa-session';
import pg from 'pg';
import{ Server as Socket } from "socket.io";

import {DBCircuitBreaker} from './utils/circuitbreaker.js';

import {router as ping} from './routes/ping.js';
import {router as auth} from './routes/auth.js';
import {router as user} from './routes/user.js';
import {router as org} from './routes/organization.js';
import {router as identity} from './routes/identity.js';
import {router as post} from './routes/post.js';
import {router as follow} from './routes/follow.js';
import { createReadStream } from 'fs';
import {middlewares, loginRequired} from './utils/middlewares.js';

import config from './config.js';

export const app = new Koa();

app.keys = [config.secret];

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
app.use(session(config.session, app));

const blueprint = new Router();
blueprint.get('/', async (ctx)=>{ 
  ctx.type = 'html';
  ctx.body = createReadStream('socket.html')
})
blueprint.use('/ping', ping.routes(), ping.allowedMethods());
blueprint.use('/auth', auth.routes(), auth.allowedMethods());
blueprint.use('/user', loginRequired, user.routes(), user.allowedMethods());
blueprint.use(
  '/identities',
  loginRequired,
  identity.routes(),
  identity.allowedMethods(),
);
blueprint.use('/orgs', loginRequired, org.routes(), org.allowedMethods());
blueprint.use('/posts', loginRequired, post.routes(), post.allowedMethods());
blueprint.use(
  '/follows',
  loginRequired,
  follow.routes(),
  follow.allowedMethods(),
);

app.use(blueprint.routes());
app.use(blueprint.allowedMethods());


export const server = http.createServer(app.callback())
const io = new Socket(server, {
  path: '/socket.io/'
});


io.on('connect', (socket) => {
  console.log('a user connected', socket);
});
