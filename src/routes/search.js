import Router from '@koa/router'
import Search from '../services/search/index.js'
import { loginOptional, loginRequired } from '../utils/middlewares/authorization.js'
import { paginate } from '../utils/middlewares/requests.js'
import * as SearchEngineService from '../services/elasticsearch/service.js'

export const router = new Router()

router.post('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Search.find(ctx.request.body, { identityId: ctx.identity.id, shouldSave: !ctx.guest }, ctx.paginate)
})

router.post('/v2', loginOptional, paginate, async (ctx) => {
  const { count, results } = await SearchEngineService.search(ctx.request.body, ctx.paginate)
  const searchResults = await Search.findV2(
    ctx.request.body,
    results.map((sr) => sr.id),
    { identityId: ctx.identity.id, shouldSave: !ctx.guest }
  )
  searchResults.map((sr) => (sr.total_count = count.value))

  ctx.body = searchResults
})

router.get('/history', loginRequired, paginate, async (ctx) => {
  ctx.body = await Search.history(ctx.identity.id, ctx.paginate)
})
