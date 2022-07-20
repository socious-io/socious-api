import 'dotenv/config';
import {app} from './src/index.js';
import Debug from 'debug';

const debug = Debug('tolling:server');
const port = normalizePort(process.env['PORT']);
app.listen(port, () => {
  debug(`API server started on :${port}`);
  console.log(`API server started on :${port}`);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
