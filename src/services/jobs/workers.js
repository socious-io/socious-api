import { sendHtmlEmail, sendTemplateEmail } from '../email/index.js'
import { simplePush } from '../fcm/index.js'
import { contactWorker } from '../sendgrid/index.js'
import { worker as eventsWorker } from '../events/worker.js'
import { worker as impactPointsWorker } from '../impact_points/worker.js'
import ProofSpace from '../proofspace/index.js'
import Analytics from '../analytics/index.js'
import logger from '../../utils/logging.js'
import config from '../../config.js'
import { connect, JSONCodec } from 'nats'

export const conn = await connect(config.nats)
export const decoder = JSONCodec()

const consumer = (handler) => {
  return async (queue) => {
    const subj = queue.getSubject()
    logger.info(`listening for ${subj}`)
    const c = 13 - subj.length
    const pad = ''.padEnd(c)
    for await (const q of queue) {
      const body = decoder.decode(q.data)
      logger.info(
        `[${subj}]${pad} #${queue.getProcessed()} - ${
          q.subject
        } ${JSON.stringify(body)}`
      )

      try {
        handler(body)
      } catch (err) {
        logger.error(`${err.message} | ${err.stack}`)
      }
    }
  }
}

// register all queues and handlers
const register = {
  email: consumer(sendHtmlEmail),
  tmp_email: consumer(sendTemplateEmail),
  fcm: consumer(simplePush),
  notify: consumer(eventsWorker),
  calculate_impact_points: consumer(impactPointsWorker),
  sendgrid_add_contacts: consumer(contactWorker),
  analytics_identitfy: consumer(Analytics.identifyWorker),
  analytics_track: consumer(Analytics.trackWorker),
  sync_proofspace: consumer(ProofSpace.SyncWorker)
}

for await (const [name, handler] of Object.entries(register)) {
  const queue = conn.subscribe(name)
  handler(queue)
}

await conn.closed()
