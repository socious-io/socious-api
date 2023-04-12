/* eslint-disable no-unreachable */
import Router from '@koa/router'
import { validate } from '@socious/data'
import Event from '../services/events/index.js'
import Chat from '../models/chat/index.js'
import { paginate } from '../utils/middlewares/requests.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { NotImplementedError } from '../utils/errors.js'
import { chatPermission, checkIdParams } from '../utils/middlewares/route.js'
import {app} from '../index.js'

export const router = new Router()

router.get('/summary', loginRequired, paginate, async (ctx) => {
  const { filter } = ctx.query
  ctx.body = await Chat.summary(ctx.identity.id, ctx.paginate, filter)
})

router.get('/:id', loginRequired, checkIdParams, chatPermission, async (ctx) => {
  ctx.body = await Chat.get(ctx.params.id)
})

router.get('/', loginRequired, paginate, async (ctx) => {
  ctx.body = await Chat.all(ctx.identity.id, ctx.paginate)
})

router.post('/find', loginRequired, async (ctx) => {
  await validate.FindChatSchema.validateAsync(ctx.request.body)
  ctx.body = { items: await Chat.find(ctx.identity.id, ctx.request.body) }
})

router.post('/', loginRequired, async (ctx) => {
  await validate.ChatSchema.validateAsync(ctx.request.body)
  ctx.body = await Chat.create(ctx.identity, ctx.request.body)
})

router.post('/update/:id', loginRequired, async (_ctx) => {
  throw new NotImplementedError()
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // ctx.body = await Chat.update(ctx.params.id, ctx.request.body);
})

router.post('/remove/:id', loginRequired, async (_ctx) => {
  throw new NotImplementedError()
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // await Chat.delete(ctx.params.id);
  // ctx.body = {message: 'success'};
})

router.get('/:id/participants', loginRequired, paginate, checkIdParams, chatPermission, async (ctx) => {
  ctx.body = await Chat.participants(ctx.params.id, ctx.paginate)
})

router.post('/update/:id/participants/mute', loginRequired, async (_ctx) => {
  throw new NotImplementedError()
  // await Chat.permissioned(ctx.identity.id, ctx.params.id);
  // await Chat.muteParticipant(
  //   ctx.params.id,
  //   ctx.identity.id,
  //   ctx.request.body.until,
  // );
  // ctx.body = {message: 'success'};
})

router.post('/update/:id/participants/:identity_id/permit', loginRequired, async (_ctx) => {
  throw new NotImplementedError()
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // ctx.body = await Chat.permitParticipant(
  //   ctx.params.id,
  //   ctx.params.identity_id,
  //   ctx.request.body.type,
  // );
})

router.post('/update/:id/participants/:identity_id', loginRequired, async (_ctx) => {
  throw new NotImplementedError()
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // await Chat.addParticipant(
  //   ctx.params.id,
  //   ctx.params.identity_id,
  //   ctx.identity.id,
  // );

  // ctx.body = {message: 'success'};
})

router.post('/remove/:id/participants/:identity_id', loginRequired, checkIdParams, async (_ctx) => {
  throw new NotImplementedError()
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // await Chat.removeParticipant(
  //   ctx.params.id,
  //   ctx.params.identity_id,
  //   ctx.identity.id,
  // );
  // ctx.body = {message: 'success'};
})

router.get('/:id/messages', loginRequired, paginate, checkIdParams, chatPermission, async (ctx) => {
  ctx.body = await Chat.messages(ctx.params.id, ctx.paginate)
})

router.post('/:id/messages', loginRequired, checkIdParams, chatPermission, async (ctx) => {
  await validate.MessageSchema.validateAsync(ctx.request.body)

  ctx.body = await Chat.newMessage(ctx.params.id, ctx.identity.id, ctx.request.body)

  const participants = await Chat.miniParticipants(ctx.params.id)

  participants
    .filter((p) => p.identity_id !== ctx.identity.id)
    .map((p) => {
      app.socket.to(app.users[p.identity_id]).emit('chat', ctx.body)

      Event.push(Event.Types.CHAT, p.identity_id, {
        ...ctx.body,
        refId: ctx.body.id,
        parentId: ctx.params.id,
        identity: ctx.identity,
        muted: p.muted_until ? p.muted_until.getTime() > new Date().getTime() : false
      })
    })
})

router.post('/:id/messages/:message_id', loginRequired, checkIdParams, chatPermission, async (ctx) => {
  await validate.MessageSchema.validateAsync(ctx.request.body)

  ctx.body = await Chat.newMessage(ctx.params.id, ctx.identity.id, ctx.request.body, ctx.params.message_id)

  const participants = await Chat.miniParticipants(ctx.params.id)

  participants
    .filter((p) => p.identity_id != ctx.identity.id)
    .map((p) =>
      Event.push(Event.Types.CHAT, p.identity_id, {
        ...ctx.body,
        refId: ctx.body.id,
        parentId: ctx.params.id,
        identity: ctx.identity,
        muted: p.muted_until ? p.muted_until.getTime() > new Date().getTime() : false
      })
    )
})

router.get('/:id/messages/:message_id', loginRequired, checkIdParams, chatPermission, paginate, async (ctx) => {
  ctx.body = await Chat.messagesReplies(ctx.params.message_id, ctx.paginate)
})

router.post('/update/:id/messages/:message_id', loginRequired, checkIdParams, chatPermission, async (ctx) => {
  await validate.MessageSchema.validateAsync(ctx.request.body)

  ctx.body = await Chat.editMessage(ctx.params.message_id, ctx.identity.id, ctx.request.body)
})

router.post('/update/:id/messages/:message_id/read', loginRequired, checkIdParams, chatPermission, async (ctx) => {
  await Chat.readMessage(ctx.params.message_id, ctx.identity.id)
  ctx.body = { message: 'success' }
})

router.post('/remove/:id/messages/:message_id', loginRequired, checkIdParams, chatPermission, async (ctx) => {
  await Chat.removeMessage(ctx.params.message_id, ctx.identity.id)
  ctx.body = { message: 'success' }
})
