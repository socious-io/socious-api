import httpAdapter from 'axios/lib/adapters/http.js'
import settle from 'axios/lib/core/settle.js'
import { policyByName } from '../circuitbreaker.js'

const settleAsync = (response) =>
  new Promise((resolve, reject) => settle(resolve, reject, response))

/**
 *
 * @param defaultCircuitBreaker
 * @example
 */
export function circuitBreaker(defaultCircuitBreaker) {
  if (defaultCircuitBreaker === undefined) {
    defaultCircuitBreaker =
      process.env.DEFAULT_CLIENT_CIRCUIT_BREAKER || 'retryWithBreaker'
  }
  return (config) =>
    policyByName(config?.circuitBreaker || defaultCircuitBreaker).execute(
      async () => settleAsync(await httpAdapter(config))
    )
}
