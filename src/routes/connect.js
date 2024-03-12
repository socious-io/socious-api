import Router from '@koa/router'
import Follow from '../models/follow/index.js'
import Connect from '../models/connect/index.js'
import Notif from '../models/notification/index.js'
import Event from '../services/events/index.js'
import { validate } from '@socious/data'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { checkIdParams, connectRequested, connectPermission } from '../utils/middlewares/route.js'
import { paginate } from '../utils/middlewares/requests.js'

export const router = new Router()

router.get('/', loginRequired, paginate, async (ctx) => {
  ctx.body = await Connect.all(ctx.identity.id, ctx.paginate)
})

router.get('/related/:identity_id', loginRequired, async (ctx) => {
  try {
    ctx.body = { connect: await Connect.related(ctx.identity.id, ctx.params.identity_id) }
  } catch {
    ctx.body = { connect: null }
  }
})

router.get('/:id', loginRequired, checkIdParams, connectPermission, async (ctx) => {
  ctx.body = await Connect.get(ctx.params.id)
})

router.post('/:identity_id', loginRequired, async (ctx) => {
  await validate.ConnectSchema.validateAsync(ctx.request.body)
  ctx.body = await Connect.send(ctx.identity.id, {
    ...ctx.request.body,
    requested_id: ctx.params.identity_id
  })

  Event.push(Event.Types.NOTIFICATION, ctx.params.identity_id, {
    type: Notif.Types.CONNECT,
    refId: ctx.body.id,
    parentId: ctx.body.id,
    identity: ctx.identity
  })
})

router.post('/:identity_id/block/direct', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Connect.directBlock(ctx.identity.id, ctx.params.identity_id)
})

router.post('/:id/accept', loginRequired, checkIdParams, connectRequested, async (ctx) => {
  ctx.body = await Connect.accept(ctx.params.id)

  Event.push(Event.Types.NOTIFICATION, ctx.body.requester_id, {
    type: Notif.Types.ACCEPT_CONNECT,
    refId: ctx.body.id,
    parentId: ctx.body.id,
    identity: ctx.identity
  })
})

router.post('/:id/disconnect', loginRequired, checkIdParams, connectPermission, async (ctx) => {
  await Connect.disconnect(ctx.params.id)
  ctx.body = { message: 'success' }
})

router.post('/:id/block', loginRequired, checkIdParams, connectPermission, async (ctx) => {
  ctx.body = await Connect.block(ctx.params.id)
  await Follow.unfollow(ctx.connection.requested_id, ctx.connection.requester_id)
  await Follow.unfollow(ctx.connection.requester_id, ctx.connection.requested_id)
})
