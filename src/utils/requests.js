import Identity from '../models/identity/index.js';

export const paginate = async (ctx, next) => {
  let page = parseInt(ctx.query.page) || 1;
  if (page < 1) page = 1;

  let limit = parseInt(ctx.query.limit) || 10;
  if (limit < 1) limit = 10;

  // TODO: we can handle ordering system here

  ctx.paginate = {page, limit, offset: (page - 1) * limit};

  await next();
  /*
    Making client suitable response expect total_count from query results array
  */
  const response = {page: page, limit: limit, total_count: 0, items: []};

  for (const i in ctx.body) {
    if (i == 0) response.total_count = parseInt(ctx.body[i].total_count);
    delete ctx.body[i].total_count;
    response.items.push(ctx.body[i]);
  }

  ctx.body = response;
};

export const identity = async (ctx, next) => {
  const currentidentity = ctx.request.header['current-identity'];
  const identityId = currentidentity || ctx.session.current_identity;

  const identity = identityId
    ? await Identity.get(identityId)
    : await Identity.get(ctx.user.id);

  await Identity.permissioned(identity, ctx.user.id);

  ctx.identity = identity.toLowerCase();

  await next();
};
