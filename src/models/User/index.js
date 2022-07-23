import * as get from './read.js';
import * as auth from './auth.js';

export default {
  ...auth,
  ...get,
};
