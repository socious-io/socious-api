import * as write from './write.js';
import * as read from './read.js';
import Data from '@socious/data'

export default {
  Types: Data.NotificationType,
  ...read,
  ...write,
};
