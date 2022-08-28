import compose from 'koa-compose';
import Auth from '../services/auth/index.js';
import http from 'http';
import User from '../models/user/index.js';
import {UnauthorizedError} from './errors.js';

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
  const token = socket.handshake.auth.token || socket.session.token;
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
