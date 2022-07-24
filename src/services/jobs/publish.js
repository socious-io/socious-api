import config from '../../config.js';
import {connect, JSONCodec} from 'nats';

export const conn = await connect(config.nats);
export const decoder = JSONCodec();

// publish queue with name and strict data as json
export default (name, data) => {
  conn.publish(name, decoder.encode(data));
};
