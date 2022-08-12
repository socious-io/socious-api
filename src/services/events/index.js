import {app} from '../../index.js';
import Notif from '../../models/notification/index.js';
import Identity from '../../models/identity/index.js';

const Types = {
  CHAT: 'chat',
  NOTIFICATION: 'notification',
};

const emitEvent = (eventType, userId, body) => {
  const connections = app.users[userId];

  if (connections === undefined) return false;

  let sent = false;

  for (const conn of connections) {
    app.socket.to(conn).emit(eventType, body);
    sent = true;
  }
  return sent;
};

// TODO we should handle all events push here
const push = async (eventType, identityId, body) => {
  const identity = await Identity.get(identityId);
  // TODO should handle notifications for organizations skip for now
  if (identity.type === Identity.Types.ORG) return;

  switch (eventType) {
    case Types.NOTIFICATION:
      await Notif.create(identityId, body.refId, body.type, body.data);
      emitEvent(eventType, identityId, body);
      // TODO: notify with other services
      break;
    case Types.CHAT:
      if (!emitEvent(eventType, identityId, body) && !body.muted) {
        body.type = Notif.Types.CHAT;
        body.refId = body.id;
        return push(Types.NOTIFICATION, identityId, body);
      }
  }
};

export default {
  Types,
  push,
};
