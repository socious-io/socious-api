import {worker} from './worker.js';
import publish from '../jobs/publish.js';

const Types = {
  CHAT: 'chat',
  NOTIFICATION: 'notification',
};

const push = (eventType, identityId, body) => {
  publish('notify', {eventType, identityId, body});
};

export default {
  Types,
  push,
  worker,
};
