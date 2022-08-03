import {app} from '../../index.js';

const Types = {
  CHAT: 'chat',
  NOTIFICATION: 'notification',
};

// TODO we should handle all events push here
const push = (eventType, userId, body = {}) => {
  const connections = app.users[userId];

  if (connections === undefined) return;

  for (const conn of connections) {
    app.socket.to(conn).emit(eventType, body);
  }
};

export default {
  Types,
  push,
};
