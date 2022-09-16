import Config from '../config.js';
import Auth from '../services/auth/index.js';
import User from '../models/user/index.js';
import Identity from '../models/identity/index.js';
import {UnauthorizedError} from './errors.js';

export const currentIdentity = async (ctx) => {
  const currentidentity = ctx.request.header['current-identity'];
  const identityId = currentidentity || ctx.session.current_identity;

  const identity = identityId
    ? await Identity.get(identityId)
    : await Identity.get(ctx.user.id);

  if (identityId) await Identity.permissioned(identity, ctx.user.id);

  ctx.identity = identity;
};

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

  // Auto refresh on sessions
  if (ctx.session.token) ctx.session.token = Auth.signin(id).access_token;

  await currentIdentity(ctx);

  await next();
};

export const loginOptional = async (ctx, next) => {
  try {
    await loginRequired(ctx, next);
  } catch {
    ctx.user = await User.getByUsername('guest');
    await currentIdentity(ctx);
    await next();
  }
};

export const accessWebhooks = async (ctx, next) => {
  const {token} = ctx.headers;

  if (Config.webhooks.token !== token)
    throw new UnauthorizedError('invalid authorization');

  await next();
};
