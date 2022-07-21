import {AuthorizationError, BadRequestError} from './errors.js'

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
    switch (err.constructor) {
    case(AuthorizationError):
      ctx.status = 403;
      ctx.body = {error: err.message};
      break;
    case(BadRequestError):
      ctx.status = 400;
      ctx.body = {error: err.message};
      break;
    default:
      throw err; 
    }
  }
}


export default [
  throwHandler
]
