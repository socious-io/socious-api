import Router from '@koa/router';
import Chat from '../models/chat/index.js';
import Notif from '../models/notification/index.js';
import Event from '../services/events/index.js';
import Webhook from '../services/webhooks/index.js';

export const router = new Router();

router.post('/notify', async (ctx) => {
  const body = ctx.request.body;

  const connections = ctx.app.users[body.user_id];

  if (!connections || connections?.length < 1) {
    ctx.body = {sent: false};
    return;
  }
  let pushBody;
  switch (body.eventType) {
    case Event.Types.NOTIFICATION:
      pushBody = await Notif.getById(body.id);
      break;
    case Event.Types.CHAT:
      pushBody = await Chat.getMessage(body.id);
      break;
    default:
      ctx.body = {sent: false};
      return;
  }

  for (const conn of connections)
    ctx.app.socket.to(conn).emit(body.eventType, JSON.stringify(pushBody));

  ctx.body = {sent: true};
});

router.post('/proofspace/claim', async (ctx) => {
  ctx.body = await Webhook.proofSpaceClaim(ctx.request.body);
});
