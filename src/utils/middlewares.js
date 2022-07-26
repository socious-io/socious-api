import compose from 'koa-compose';
import jwt from 'jsonwebtoken';
import User from '../services/user/index.js';
import config from '../config.js';
import {
  NotMatchedError,
  AuthorizationError,
  BadRequestError,
  ValidationError,
  EntryError,
  PermissionError,
  UnauthorizedError,
} from './errors.js';

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
    if (err instanceof UnauthorizedError) {
      ctx.status = 401;
      return;
    }

    if (err instanceof AuthorizationError || PermissionError) {
      ctx.status = 403;
      return;
    }

    if (err instanceof BadRequestError || NotMatchedError || ValidationError) {
      ctx.status = 400;
      return;
    }

    if (err instanceof EntryError) {
      ctx.status = 406;
      return;
    }

    ctx.status = 500;
  }
};

export const middlewares = compose([throwHandler]);

export const loginRequired = async (ctx, next) => {
  const {authorization} = ctx.request.header;

  const token = authorization
    ? authorization?.replace('Bearer ', '')
    : ctx.session.token;

  const {id} = jwt.verify(token, config.secret);

  if (!id) throw new UnauthorizedError();

  try {
    ctx.user = await User.get(id);
  } catch {
    throw new UnauthorizedError();
  }

  await next();
};
