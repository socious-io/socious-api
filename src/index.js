import Koa from 'koa';
import http from 'http';
import Router from '@koa/router';
import morgan from 'koa-morgan';
import koaBody from 'koa-body';
import session from 'koa-session';
import pg from 'pg';

import {DBCircuitBreaker} from './utils/circuitbreaker.js';

import {router as ping} from './routes/ping.js';
import {router as auth} from './routes/auth.js';
import {router as user} from './routes/user.js';
import {router as org} from './routes/organization.js';
import {router as identity} from './routes/identity.js';
import {router as post} from './routes/post.js';
import {router as follow} from './routes/follow.js';
import {router as notif} from './routes/notification.js';
import {router as project} from './routes/project.js';
import {router as chat} from './routes/chat.js';
import {router as device} from './routes/device.js';
import {router as media} from './routes/media.js';
import {router as skill} from './routes/skill.js';
import {router as search} from './routes/search.js';
import {router as webhook} from './routes/webhook.js';

import {
  middlewares,
  retryBlocker,
  socketSessions,
  socketLoginRequired,
  accessWebhooks,
} from './utils/middlewares.js';

import {Server as Socket} from 'socket.io';

import config from './config.js';

export const app = new Koa({proxy: true});

app.keys = [config.secret];
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
app.use(session(config.session, app));

const blueprint = new Router();

blueprint.use(
  '/webhooks',
  accessWebhooks,
  webhook.routes(),
  webhook.allowedMethods(),
);

blueprint.use('/ping', ping.routes(), ping.allowedMethods());
blueprint.use('/auth', retryBlocker, auth.routes(), auth.allowedMethods());
blueprint.use('/user', user.routes(), user.allowedMethods());
blueprint.use(
  '/identities',
  identity.routes(),
  identity.allowedMethods(),
);
blueprint.use('/orgs', org.routes(), org.allowedMethods());
blueprint.use('/posts', post.routes(), post.allowedMethods());
blueprint.use(
  '/projects',
  project.routes(),
  project.allowedMethods(),
);
blueprint.use(
  '/follows',
  follow.routes(),
  follow.allowedMethods(),
);
blueprint.use(
  '/notifications',
  notif.routes(),
  notif.allowedMethods(),
);

blueprint.use('/chats', chat.routes(), chat.allowedMethods());
blueprint.use(
  '/devices',
  device.routes(),
  device.allowedMethods(),
);

blueprint.use('/media', media.routes(), media.allowedMethods());
blueprint.use('/skills', skill.routes(), skill.allowedMethods());
blueprint.use(
  '/search',
  search.routes(),
  search.allowedMethods(),
);

app.use(blueprint.routes());
app.use(blueprint.allowedMethods());

app.http = http.createServer(app.callback());
app.listen = app.listen = (...args) => {
  app.http.listen.call(app.http, ...args);
  return app.http;
};

app.socket = new Socket(app.http, config.socket);
app.socket.use(socketSessions(app));
app.socket.use(socketLoginRequired);

/* 
socket handler will push every auth users connection ids to app.users
will purge it when connection closed 
*/
app.socket.on('connect', async (socket) => {
  const socketId = socket.id;
  const userId = socket.userId;

  if (!app.users[userId]) app.users[socket.userId] = [];
  app.users[userId].push(socketId);

  socket.on('disconnect', () => {
    const index = app.users[userId].indexOf(socketId);
    app.users[userId].splice(index, 1);
  });
});
