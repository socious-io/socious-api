import Router from '@koa/router';
import Event from '../services/events/index.js';
import Chat from '../models/chat/index.js';
import {paginate, identity} from '../utils/requests.js';

export const router = new Router();

router.get('/:id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.get(ctx.params.id);
});

router.get('/', identity, paginate, async (ctx) => {
  ctx.body = await Chat.all(ctx.identity.id, ctx.paginate);
});

router.get('/:id/participants', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.participants(ctx.params.id);
});

router.post('/', identity, async (ctx) => {
  ctx.body = await Chat.create(ctx.identity.id, ctx.body);
});

router.put('/:id', identity, async (ctx) => {
  await Chat.permissioned(
    ctx.identity.id,
    ctx.params.id,
    Chat.MemberTypes.ADMIN,
  );
  ctx.body = await Chat.update(ctx.params.id, ctx.body);
});

router.put('/:id/participants/:identity_id', identity, async (ctx) => {
  await Chat.permissioned(
    ctx.identity.id,
    ctx.params.id,
    Chat.MemberTypes.ADMIN,
  );
  ctx.body = await Chat.addParticipant(
    ctx.params.id,
    ctx.params.identity_id,
    ctx.identity.id,
  );
});

router.delete('/:id/participants/:identity_id', identity, async (ctx) => {
  await Chat.permissioned(
    ctx.identity.id,
    ctx.params.id,
    Chat.MemberTypes.ADMIN,
  );
  ctx.body = await Chat.removeParticipant(
    ctx.params.id,
    ctx.params.identity_id,
    ctx.identity.id,
  );
});

router.put('/:id/permit/participants/:identity_id', identity, async (ctx) => {
  await Chat.permissioned(
    ctx.identity.id,
    ctx.params.id,
    Chat.MemberTypes.ADMIN,
  );
  ctx.body = await Chat.permitParticipant(
    ctx.params.id,
    ctx.params.identity_id,
    ctx.body.type,
  );
});

router.put('/:id/mute/participants', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.muteParticipant(
    ctx.params.id,
    ctx.identity.id,
    ctx.body.until,
  );
});

router.get('/:id/messages', identity, paginate, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.messages(ctx.params.id, ctx.paginate);
});

router.post('/:id/messages', identity, paginate, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.newMessage(
    ctx.params.id,
    ctx.identity.id,
    ctx.body.text,
  );

  const participants = await Chat.participants(ctx.params.id);

  await Promise.all(
    participants.map((p) =>
      Event.push(Event.Types.Chat, p.identity_id, {
        ...ctx.body,
        muted: p.muted_until.getTime() > new Date().getTime(),
      }),
    ),
  );
});

router.post('/:id/messages/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.newMessage(
    ctx.params.id,
    ctx.identity.id,
    ctx.body.text,
    ctx.params.message_id,
  );

  const participants = await Chat.participants(ctx.params.id);

  await Promise.all(
    participants.map((p) =>
      Event.push(Event.Types.Chat, p.identity_id, {
        ...ctx.body,
        muted: p.muted_until.getTime() > new Date().getTime(),
      }),
    ),
  );
});

router.get(
  '/:id/messages/:message_id/replies',
  identity,
  paginate,
  async (ctx) => {
    await Chat.permissioned(ctx.identity.id, ctx.params.id);
    ctx.body = await Chat.messagesReplies(ctx.params.message_id, ctx.paginate);
  },
);

router.put('/:id/messages/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.editMessage(
    ctx.params.message_id,
    ctx.identity.id,
    ctx.body.text,
  );
});

router.put('/:id/messages/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.editMessage(
    ctx.params.message_id,
    ctx.identity.id,
    ctx.body.text,
  );
});

router.put('/:id/messages/:message_id/read', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.readMessage(ctx.params.message_id);
});

router.delete('/:id/messages/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.removeMessage(ctx.params.message_id, ctx.identity.id);
});
