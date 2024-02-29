import Router from '@koa/router'
import Referring from '../models/referring/index.js'
import { checkIdParams } from '../utils/middlewares/route.js'
import { loginRequired } from '../utils/middlewares/authorization.js'

export const router = new Router()

router.get('/getReferrer/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Referring.get(ctx.params.id)
})
