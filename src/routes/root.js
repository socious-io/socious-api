import Shortner from '../models/shortner/index.js'
import Router from '@koa/router'

export const router = new Router()

router.get('/r/:id', async (ctx) => {
  const shorner = await Shortner.get(ctx.params.id)
  ctx.redirect(shorner.long_url)
})

router.get('/r/:id/fetch', async (ctx) => {
  ctx.body = await Shortner.get(ctx.params.id)
})
