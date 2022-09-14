import compose from 'koa-compose';
import Cors from '@koa/cors';
import Auth from '../services/auth/index.js';
import http from 'http';
import User from '../models/user/index.js';
import Identity from '../models/identity/index.js';
import Config from '../config.js';
import {UnauthorizedError, TooManyRequestsError} from './errors.js';

const cors = new Cors({
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

const throwHandler = async (ctx, next) => {
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

export const loginRequired = async (ctx) => {
  const {authorization} = ctx.request.header;

  const token = authorization
    ? authorization?.replace('Bearer ', '')
    : ctx.session.token;

  if (!token) throw new UnauthorizedError('No authentication');
  let id;
  try {
    id = (await Auth.verifyToken(token)).id;
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
  try {
    ctx.user = await User.get(id);
  } catch {
    throw new UnauthorizedError('Unknown user');
  }

  // Auto refresh on sessions
  if (ctx.session.token) ctx.session.token = Auth.signin(id).access_token;

};

export const currentIdentity = async (ctx) => {
  const currentidentity = ctx.request.header['current-identity'];
  const identityId = currentidentity || ctx.session.current_identity;

  const identity = identityId
    ? await Identity.get(identityId)
    : await Identity.get(ctx.user.id);

  if (identityId) await Identity.permissioned(identity, ctx.user.id);

  ctx.identity = identity;
};


export const authorization = async (ctx, next) => {
  const publicRoutes = [
    /^\/auth/,
    /^\/posts\/?$/,
    /^\/user\/.+\/profile\/?$/,
    /^\/orgs\/by-shortname\/[a-z0-9._-]+\/?$/,
    /^\/orgs\/[a-z0-9-]+\/?$/,
    /^\/projects\/?$/,
    /^\/projects\/[a-z0-9-]+\/?$/
  ]

  const loginOptional = publicRoutes.some(ex => ex.test(ctx.path))

  try {
    await loginRequired(ctx)
  } catch (e) {
    if (!loginOptional) throw e
    ctx.user = await User.getByUsername('guest')
  }

  await currentIdentity(ctx)

  await next()
}

export const middlewares = compose([cors, throwHandler, authorization]);



export const socketSessions = (app) => {
  return (socket, next) => {
    // create a new (fake) Koa context to decrypt the session cookie
    let ctx = app.createContext(socket.request, new http.OutgoingMessage());
    socket.session = ctx.session;
    return next();
  };
};

export const socketLoginRequired = async (socket, next) => {
  const token =
    socket.handshake.auth.token ||
    socket.handshake.headers.authorization ||
    socket.session.token;

  if (!token) return next(new UnauthorizedError());

  try {
    const {id} = await Auth.verifyToken(token);
    // TODO: we can fetch user if need
    // socket.user = await User.get(id);
    socket.userId = id;
  } catch {
    return next(new UnauthorizedError());
  }
  return next();
};

const retryBlockerData = {};
/**
 * this would work on all routes that use this middlware would block and send 429 http error
 * after retryCount exceed would refresh ip after reset timer
 */
export const retryBlocker = async (ctx, next) => {
  let error;
  // 1 Minute to reset retry
  const resetTimer = 60 * 1000;
  // 2 Hours block after retry count exceed
  const blockerTimer = 2 * 60 * 60 * 1000;
  // would block after this count exceed
  const retryCount = 10;
  // Note: This must be overide on Nginx
  const ip = ctx.request.header['x-real-ip'] || ctx.request.ip;
  const now = new Date();

  if (
    retryBlockerData[ip]?.blocked <
    new Date(now.getTime() + blockerTimer).getTime()
  )
    throw new TooManyRequestsError();

  if (
    retryBlockerData[ip]?.blocked ||
    retryBlockerData[ip]?.reset < now.getTime()
  )
    delete retryBlockerData[ip];

  try {
    await next();
  } catch (err) {
    error = err;
  }

  if (!retryBlockerData[ip]?.retry) {
    retryBlockerData[ip] = {};
    retryBlockerData[ip].retry = 0;
  }

  if (ctx.status < 500) {
    retryBlockerData[ip].reset = now.getTime() + resetTimer;
    retryBlockerData[ip].retry++;
  }

  if (retryBlockerData[ip].retry > retryCount)
    retryBlockerData[ip].blocked = now.getTime() + blockerTimer;

  if (error) throw error;
};

export const accessWebhooks = async (ctx, next) => {
  const {token} = ctx.headers;

  if (Config.webhooks.token !== token)
    throw new UnauthorizedError('invalid authorization');

  await next();
};
