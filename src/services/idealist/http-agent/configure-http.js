import axios from 'axios'
import { createHttpAgent, createHttpsAgent } from './create-http-agent.js'

/**
 *
 * @example
 */
export function configureHttp() {
  axios.defaults.httpAgent = createHttpAgent()
  axios.defaults.httpsAgent = createHttpsAgent()
  console.log('Axios agentkeepalive running...')
}
