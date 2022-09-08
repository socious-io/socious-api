import {app} from '../../index.js';
import publish from '../jobs/publish.js';
import Device from '../../models/device/index.js';
import Notif from '../../models/notification/index.js';
import Identity from '../../models/identity/index.js';
import Org from '../../models/organization/index.js';

import {makeMessage} from './message.js';

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

const pushNotifications = async (userIds, notification, data) => {
  const devices = await Device.any(userIds);
  publish('fcm', {tokens: devices.map((d) => d.token), notification, data});
};

const _push = async (eventType, userId, body) => {
  switch (eventType) {
    case Types.NOTIFICATION:
      var message = makeMessage(body.type, body);
      await Notif.create(userId, body.refId, body.type, {
        ...body,
        body: message,
      });

      emitEvent(eventType, userId, body);
      pushNotifications([userId], message, body);
      break;
    case Types.CHAT:
      if (!emitEvent(eventType, userId, body) && !body.muted) {
        body.type = Notif.Types.CHAT;
        body.refId = body.id;
        _push(Types.NOTIFICATION, userId, body);
      }
      break;
    default:
      throw new Error('Unhandled notification');
  }
};

const batchPush = async (eventType, identityIds, body) => {
  const identities = await Identity.getByIds(identityIds);

  return Promise.all(
    identities.map(async (i) => {
      if (i.type === Identity.Types.ORG) {
        const members = await Org.miniMembers(i.id);
        return batchPush(
          eventType,
          members.map((m) => m.user_id),
          body,
        );
      }

      return _push(eventType, i.id, body);
    }),
  );
};

const push = async (eventType, identityId, body) => {
  const identity = await Identity.get(identityId);

  if (identity.type === Identity.Types.ORG) {
    const members = await Org.miniMembers(identityId.id);
    return batchPush(
      eventType,
      members.map((m) => m.user_id),
      body,
    );
  }

  return _push(eventType, identity.id, body);
};

export default {
  Types,
  batchPush,
  push,
};
