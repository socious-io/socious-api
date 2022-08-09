import Router from '@koa/router';
import { Event } from '../services/events/index.js';
import Chat from '../models/chat/index.js';
import {paginate, identity} from '../utils/requests.js';

export const router = new Router();


router.get('/:id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id)
  ctx.body = await Chat.get(ctx.params.id);
});


router.get('/', identity, paginate, async (ctx) => {
  ctx.body = await Chat.all(ctx.identity.id, ctx.paginate);
});


router.get('/:id/participants', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id)
  ctx.body = await Chat.participants(ctx.params.id);
});


router.post('/', identity, async (ctx) => {
  ctx.body = await Chat.create(ctx.identity.id, ctx.body);
});


router.put('/:id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id, Chat.MemberTypes.ADMIN)
  ctx.body = await Chat.update(ctx.params.id, ctx.body);
});


router.put('/:id/participants/:identity_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id, Chat.MemberTypes.ADMIN)
  ctx.body = await Chat.addParticipant(ctx.params.id, ctx.params.identity_id, ctx.identity.id);
});

router.delete('/:id/participants/:identity_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id, Chat.MemberTypes.ADMIN)
  ctx.body = await Chat.removeParticipant(ctx.params.id, ctx.params.identity_id, ctx.identity.id);
});


router.put('/:id/permit/participants/:identity_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id, Chat.MemberTypes.ADMIN)
  ctx.body = await Chat.permitParticipant(ctx.params.id, ctx.params.identity_id, ctx.body.type);
});


router.put('/:id/mute/participants', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id)
  ctx.body = await Chat.muteParticipant(ctx.params.id, ctx.identity.id, ctx.body.until);
});


router.post('/:id/message', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id)
  ctx.body = await Chat.newMessage(ctx.params.id, ctx.identity.id, ctx.body.text);

  const participants = await Chat.participants(ctx.params.id)
  
  await Promise.all(participants.map(p => Event.push(Event.Types.Chat, p.identity_id, {
    ...ctx.body,
    muted: p.muted_until.getTime() > new Date().getTime()
  })));

});


router.post('/:id/message/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id)
  ctx.body = await Chat.newMessage(ctx.params.id, ctx.identity.id, ctx.body.text, ctx.params.message_id);
  
  const participants = await Chat.participants(ctx.params.id)

  await Promise.all(participants.map(p => Event.push(Event.Types.Chat, p.identity_id, {
    ...ctx.body,
    muted: p.muted_until.getTime() > new Date().getTime()
  })));
});


router.put('/:id/message/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id)
  ctx.body = await Chat.editMessage(ctx.params.message_id, ctx.identity.id, ctx.body.text);
});


router.delete('/:id/message/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id)
  ctx.body = await Chat.removeMessage(ctx.params.message_id, ctx.identity.id);
});
