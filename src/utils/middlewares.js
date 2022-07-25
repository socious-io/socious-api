import {
  NotMatchedError,
  AuthorizationError,
  BadRequestError,
  ValidationError,
  EntryError,
  PermissionError,
} from './errors.js';
import compose from 'koa-compose';
import jwt from 'jsonwebtoken';

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
    if (err.name === 'UnauthorizedError') {
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

const decodeToken = async (ctx, next) => {
  const {authorization} = ctx.request.header;
  if (authorization) {
    const {id} = jwt.decode(authorization?.replace('Bearer ', ''));
    ctx.userId = id;
  }
  await next();
};

export default compose([decodeToken, throwHandler]);
