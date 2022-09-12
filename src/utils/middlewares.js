import compose from 'koa-compose';
import Auth from '../services/auth/index.js';
import http from 'http';
import User from '../models/user/index.js';
import {UnauthorizedError, TooManyRequestsError} from './errors.js';

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

export const middlewares = compose([throwHandler]);

export const loginRequired = async (ctx, next) => {
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

  await next();
};

export const socketSessions = (app) => {
  return (socket, next) => {
    // create a new (fake) Koa context to decrypt the session cookie
    let ctx = app.createContext(socket.request, new http.OutgoingMessage());
    socket.session = ctx.session;
    return next();
  };
};

export const socketLoginRequired = async (socket, next) => {
  const token = socket.handshake.auth.token
    || socket.handshake.headers.authorization 
    || socket.session.token;


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
