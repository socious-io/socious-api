import { worker, Types } from './worker.js'
import publish from '../jobs/publish.js'

const push = (eventType, identityId, body) => {
  publish('notify', { eventType, identityId, body })
}

export default {
  Types,
  push,
  worker
}
