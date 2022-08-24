import * as write from './write.js';
import * as read from './read.js';
import * as comment from './comment.js';
import * as like from './like.js';

export default {
  ...read,
  ...write,
  ...comment,
  ...like,
};
