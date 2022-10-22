const filters = (ctx) => {
  const result = {};

  for (const [key, val] of Object.entries(ctx.query)) {
    if (!key.includes('filter.')) continue;
    result[key.split('filter.')[1]] = val;
  }

  return result;
};

export const paginate = async (ctx, next) => {
  let page = parseInt(ctx.query.page) || 1;
  if (page < 1) page = 1;

  let limit = parseInt(ctx.query.limit) || 10;
  if (limit < 1) limit = 10;

  // TODO: we can handle ordering system here

  ctx.paginate = {
    page,
    limit,
    offset: (page - 1) * limit,
    filter: filters(ctx),
    sort: ctx.query.sort,
  };

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
