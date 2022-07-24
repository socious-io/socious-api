import {sendHtmlEmail} from '../email/index.js';

import config from '../../config.js';
import {connect, JSONCodec} from 'nats';

export const conn = await connect(config.nats);
export const decoder = JSONCodec();

const consumer = (handler) => {
  return async (queue) => {
    let subj = queue.getSubject();
    console.log(`listening for ${subj}`);
    const c = 13 - subj.length;
    const pad = ''.padEnd(c);
    for await (const q of queue) {
      const body = decoder.decode(q.data);
      console.log(
        `[${subj}]${pad} #${queue.getProcessed()} - ${
          q.subject
        } ${JSON.stringify(body)}`,
      );

      handler(body);
    }
  };
};

// register all queues and handlers
const register = {
  email: consumer(sendHtmlEmail),
};

for await (const [name, handler] of Object.entries(register)) {
  const queue = conn.subscribe(name);
  handler(queue);
}

await conn.closed();
