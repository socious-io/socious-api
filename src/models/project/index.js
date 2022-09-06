import * as write from './write.js';
import * as read from './read.js';
import * as enums from './enums.js';
import * as questions from './questions.js';

export default {
  ...enums,
  ...read,
  ...write,
  ...questions,
};
