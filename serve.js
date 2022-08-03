import Config from './src/config.js';
import {app} from './src/index.js';
import Debug from 'debug';

const debug = Debug('tolling:server');

app.listen(Config.port, () => {
  debug(`API server started on :${Config.port}`);
  console.log(`API server started on :${Config.port}`);
});
