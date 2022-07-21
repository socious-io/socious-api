import config from './src/config'
import {app} from './src/index.js';
import Debug from 'debug';

const debug = Debug('tolling:server');

app.listen(config.port, () => {
  debug(`API server started on :${config.port}`);
  console.log(`API server started on :${config.port}`);
});
