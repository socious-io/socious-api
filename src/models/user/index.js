import * as write from './write.js';
import * as read from './read.js';
import * as enums from './enums.js';
import * as additionals from './additionals.js';

export default {
  ...enums,
  ...read,
  ...write,
  ...additionals,
};
