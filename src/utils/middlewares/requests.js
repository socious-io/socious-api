const filters = (ctx) => {
  const result = {}

  for (let [key, val] of Object.entries(ctx.query)) {
    // for BC 2 filter routes
    if (key === 'status') key = 'filter.status'
    if (key === 'identity_id') key = 'filter.identity_id'

    if (!key.includes('filter.')) continue

    result[key.split('filter.')[1]] = val
  }

  return result
}

export const paginate = async (ctx, next) => {
  let page = parseInt(ctx.query.page) || 1
  if (page < 1) page = 1

  let limit = parseInt(ctx.query.limit) || 10
  if (limit < 1) limit = 10
  if (limit > 1000) limit = 1000
  
  ctx.paginate = {
    page,
    limit,
    offset: (page - 1) * limit,
    filter: filters(ctx),
    sort: ctx.query.sort
  }

  await next()
  /*
    Making client suitable response expect total_count from query results array
  */
  const response = { page, limit, total_count: 0, items: [] }

  for (let i = 0; i < ctx.body.length; i++) {
    if (i == 0) response.total_count = parseInt(ctx.body[i].total_count) || ctx.body.length
    if (i + 1 > limit) break
    delete ctx.body[i].total_count
    response.items.push(ctx.body[i])
  }

  ctx.body = response
}

export const paginateCTX = async (ctx, next) => {
  let page = parseInt(ctx.query.page) || 1
  if (page < 1) page = 1

  let limit = parseInt(ctx.query.limit) || 10
  if (limit < 1) limit = 10

  ctx.paginate = {
    page,
    limit,
    offset: (page - 1) * limit,
    filter: filters(ctx),
    sort: ctx.query.sort
  }

  return next()
}
