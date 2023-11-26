import Router from '@koa/router'
import { validate } from '@socious/data'
import { loginOptional, loginRequired } from '../utils/middlewares/authorization.js'
import { checkIdParams } from '../utils/middlewares/route.js'
import Additionals from '../models/additionals/index.js'
import { PermissionError } from '../utils/errors.js'

export const router = new Router()

router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = await Additionals.get(ctx.params.id)
})

router.post('/', loginRequired, async (ctx) => {
  await validate.AdditinalSchema.validateAsync(ctx.request.body)
  let identity = ctx.identity.id
  if (ctx.request.body.ref_identity_id) {
    identity = ctx.request.body.ref_identity_id
    ctx.request.body.ref_identity_id = ctx.identity.id
    ctx.request.body.enabled = false
  }
  ctx.body = await Additionals.insert(identity, ctx.request.body)
})

router.post('/update/:id', loginRequired, async (ctx) => {
  const add = await Additionals.get(ctx.params.id)
  if (add.identity_id != ctx.identity.id) throw new PermissionError()
  await validate.AdditinalSchema.validateAsync(ctx.request.body)
  ctx.body = await Additionals.update(ctx.params.id, ctx.request.body)
})

router.post('/remove/:id', loginRequired, async (ctx) => {
  const add = await Additionals.get(ctx.params.id)
  if (add.identity_id != ctx.identity.id) throw new PermissionError()
  await Additionals.remove(ctx.params.id)
  ctx.body = { message: 'success' }
})
