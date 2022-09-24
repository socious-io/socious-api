import {start} from './src/services/idealist/index.js';
import {checkIdealist} from './src/services/idealist/check_active.js';

if (process.argv[2] === '--check') {
  checkIdealist();
} else {
  start();
}
