import Data from '@socious/data';
import Config from '../../config.js';
import publish from '../jobs/publish.js';
import Device from '../../models/device/index.js';
import Notif from '../../models/notification/index.js';
import Identity from '../../models/identity/index.js';
import Org from '../../models/organization/index.js';
import {makeMessage} from './message.js';
import axios from 'axios';

export const Types = {
  CHAT: 'chat',
  NOTIFICATION: 'notification',
};

const emitEvent = async (eventType, userId, id) => {
  try {
    const res = await axios.post(
      `${Config.webhooks.addr}/notify`,
      {eventType, id, user_id: userId},
      {headers: {token: Config.webhooks.token}},
    );
    return res.data.sent;
  } catch {
    return false;
  }
};

const getSetting = async (userId, type) => {
  let setting = (await Notif.settings(userId))?.filter(
    (s) => s.type === type,
  )[0];
  if (!setting)
    setting = {
      in_app: true,
      email: true,
      push: true,
    };
  return setting;
};

const coordinateNotifs = async (userId, body) => {
  const setting = await getSetting(userId, body.type);

  const consolidateExceptions = [
    Data.NotificationType.APPLICATION,
    Data.NotificationType.FOLLOWED,
  ];

  let name = body.identity?.meta?.name;
  let message = makeMessage(body.type, name);
  const consolidateTime = 30 * 60 * 1000;
  const now = new Date();
  const latest = await Notif.latest(
    userId,
    body.type,
    new Date(now.getTime() - consolidateTime),
  );

  if (latest && !consolidateExceptions.includes(body.type)) {
    let consolidateNumbs = latest.data.consolidate_number + 1;
    if (consolidateNumbs < 2) consolidateNumbs = 2;

    message = makeMessage(body.type, `${consolidateNumbs} people`);

    await Notif.update(latest.id, userId, body.refId, body.type, {
      ...body,
      body: message,
      consolidate_number: consolidateNumbs,
    });

    if (setting.in_app) await emitEvent(Types.NOTIFICATION, userId, latest.id);

    if (setting.push) await pushNotifications([userId], message, body);
    return;
  }

  var notifId = await Notif.create(userId, body.refId, body.type, {
    ...body,
    body: message,
    consolidate_number: 0,
  });

  if (setting.in_app) await emitEvent(Types.NOTIFICATION, userId, notifId);

  if (setting.push) await pushNotifications([userId], message, body);
};

const pushNotifications = async (userIds, notification, data) => {
  const devices = await Device.any(userIds);
  publish('fcm', {tokens: devices.map((d) => d.token), notification, data});
};

const _push = async (eventType, userId, body) => {
  switch (eventType) {
    case Types.NOTIFICATION:
      await coordinateNotifs(userId, body);
      break;
    case Types.CHAT:
      if (!emitEvent(eventType, userId, body.id) && !body.muted) {
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
      if (i.type === Data.IdentityType.ORG) {
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

export const worker = async ({eventType, identityId, body}) => {
  const identity = await Identity.get(identityId);

  if (identity.type === Data.IdentityType.ORG) {
    const members = await Org.miniMembers(identityId.id);
    return batchPush(
      eventType,
      members.map((m) => m.user_id),
      body,
    );
  }

  return _push(eventType, identity.id, body);
};
