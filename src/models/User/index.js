import * as write from './write.js';
import * as read from './read.js';
import * as auth from './auth.js';

export default {
  ...auth,
  ...read,
  ...write,
};
