import Agent from 'agentkeepalive'

/**
 *
 * @example
 */
export function createHttpAgent() {
  return new Agent({
    maxSockets: 5,
    maxFreeSockets: 2,
    timeout: 60000,
    freeSocketTimeout: 15000
  })
}

/**
 *
 * @example
 */
export function createHttpsAgent() {
  return new Agent.HttpsAgent({
    maxSockets: 5,
    maxFreeSockets: 2,
    timeout: 60000,
    freeSocketTimeout: 15000
  })
}
