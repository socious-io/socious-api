import * as write from './write.js';
import * as read from './read.js';

const Types = {
  FOLLOWED: 'FOLLOWED',
  COMMENT_LIKE: 'COMMENT_LIKE',
  POST_LIKE: 'POST_LIKE',
  CHAT: 'CHAT',
  SHARE_POST: 'SHARE_POST',
  SHARE_PROJECT: 'SHARE_PROJECT',
  COMMENT: 'COMMENT',
  APPLICATION: 'APPLICATION',
};

// TODO: make this messages better
const Messages = {
  FOLLOWED: 'followed',
  COMMENT_LIKE: 'comment liked',
  POST_LIKE: 'post liked',
  CHAT: 'chat',
  SHARE_POST: 'post shared',
  SHARE_PROJECT: 'project shared',
  COMMENT: 'commented',
  APPLICATION: 'applied',
};

export default {
  Messages,
  Types,
  ...read,
  ...write,
};
