import * as write from './write.js';
import * as read from './read.js';
import * as comment from './comment.js';

export default {
  ...read,
  ...write,
  ...comment,
};
