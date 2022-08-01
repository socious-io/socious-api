import Config from './src/config.js';
import {server} from './src/index.js';
import Debug from 'debug';

const debug = Debug('tolling:server');

server.listen(Config.port, () => {
  debug(`API server started on :${Config.port}`);
  console.log(`API server started on :${Config.port}`);
});
