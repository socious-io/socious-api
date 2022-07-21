import {
  NotMatchedError,
  AuthorizationError,
  BadRequestError,
  ValidationError,
  EntryError,
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

    switch (err.name) {
      case 'ValidationError':
        ctx.status = 400;
        ctx.body = {error: err.message};
        return;
      case 'UnauthorizedError':
        ctx.status = 401;
        ctx.body = {error: err.message};
        return;
    }

    switch (err.constructor) {
      case AuthorizationError:
        ctx.status = 403;
        ctx.body = {error: err.message};
        return;
      case (BadRequestError, NotMatchedError, ValidationError):
        ctx.status = 400;
        ctx.body = {error: err.message};
        return;
      case (EntryError):
        ctx.status = 406;
        ctx.body = {error: err.message};
        return;
      default:
        throw err;
    }
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
