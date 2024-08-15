import Router from '@koa/router'
import Search from '../services/search/index.js'
import { loginOptional, loginRequired } from '../utils/middlewares/authorization.js'
import { paginate } from '../utils/middlewares/requests.js'
import { InternalServerError } from '../utils/errors.js'

export const router = new Router()

router.post('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Search.find(ctx.request.body, { identityId: ctx.identity.id, shouldSave: !ctx.guest }, ctx.paginate)
})

router.post('/v2', loginOptional, paginate, async (ctx) => {
  if (!ctx.searchClient) throw new InternalServerError()
  ctx.body = await ctx.searchService.search(ctx.request.body, ctx.paginate)
  if (!ctx.guest) await Search.addHistory(ctx.request.body, ctx.identity.id)
})

router.get('/history', loginRequired, paginate, async (ctx) => {
  ctx.body = await Search.history(ctx.identity.id, ctx.paginate)
})
