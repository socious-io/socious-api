import * as read from './read.js';
import * as write from './write';
import * as feedback from './feedback';

export default {
  ...read,
  ...write,
  ...feedback,
};
