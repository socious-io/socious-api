import Router from '@koa/router'
import { loginRequired } from '../utils/middlewares/authorization.js'
import Device from '../models/device/index.js'
import { validate } from '@socious/data'

export const router = new Router()

router.get('/', loginRequired, async (ctx) => {
  ctx.body = await Device.all(ctx.user.id)
})

router.post('/', loginRequired, async (ctx) => {
  await validate.DeviceNewSchema.validateAsync(ctx.request.body)
  ctx.body = await Device.insert(ctx.user.id, ctx.request.body)
})

router.post('/update', loginRequired, async (ctx) => {
  await validate.DeviceNewSchema.validateAsync(ctx.request.body)
  ctx.body = await Device.update(ctx.user.id, ctx.request.body)
})

router.post('/remove/:token', loginRequired, async (ctx) => {
  await Device.remove(ctx.user.id, ctx.params.token)
  ctx.body = { message: 'success' }
})
