import {Policy, ConsecutiveBreaker} from 'cockatiel';
import Debug from 'debug';
import Config from '../config.js';
import {readFile} from 'fs/promises';
const debug = Debug('socious-api:circuitbreaker');
import {NotMatchedError} from './errors.js';

// Create a retry policy that'll try whatever function we execute 3
// times with a randomized exponential backoff.
export const retry = Policy.handleAll().retry().attempts(3).exponential();
retry.onFailure(({duration, handled, reason}) => {
  debug(`retry call ran in ${duration}ms and failed with`, reason);
  debug(handled ? 'error was handled' : 'error was not handled');
});

// Create a circuit breaker that'll stop calling the executed function for 10
// seconds if it fails 5 times in a row. This can give time for e.g. a database
// to recover without getting tons of traffic.
export const circuitBreaker = Policy.handleAll().circuitBreaker(
  10 * 1000,
  new ConsecutiveBreaker(5),
);
circuitBreaker.onFailure(({duration, handled, reason}) => {
  debug(`circuit breaker call ran in ${duration}ms and failed with`, reason);
  debug(handled ? 'error was handled' : 'error was not handled');
});

// Combine these! Create a policy that retries 3 times, calling through the circuit breaker
export const retryWithBreaker = Policy.wrap(retry, circuitBreaker);

const policies = {
  none: Policy.noop,
  retry,
  circuitBreaker,
  retryWithBreaker,
  SSO: Policy.wrap(
    Policy.handleAll().retry().attempts(30).exponential({initialDelay: 1000}),
    circuitBreaker,
  ),
};

export const policyByName = (name) => policies[name];

export class DBCircuitBreaker {
  // TODO: chache this with Redis or etc ...
  cache = {};
  constructor(pool, policy) {
    this.pool = pool;
    this.policy = policyByName(
      policy || process.env.DEFAULT_DB_CIRCUIT_BREAKER || 'none',
    );
  }

  async getQueryFromFile(name) {
    if (this.cache[name] && Config.debug === false) return this.cache[name];

    const query = await readFile(`src/sql/${name}.sql`);
    this.cache[name] = query.toString();
    return this.cache[name];
  }

  async execute(name, ...args) {
    const q = await this.getQueryFromFile(name);
    return this.query(q, args);
  }

  query(...args) {
    return this.policy.execute(() => this.pool.query(...args));
  }

  async get(...args) {
    const {rows} = await this.query(...args);
    if (rows.length < 1) throw new NotMatchedError();
    return rows[0];
  }

  async with(fn) {
    const client = await this.pool.connect();
    try {
      await fn({
        client,
        query: (...args) => {
          return this.policy.execute(() => client.query(...args));
        },
        async get(...args) {
          const {rows} = await this.query(...args);
          if (rows.length < 1) throw new NotMatchedError();
          return rows[0];
        },
      });
    } finally {
      client.release();
    }
  }
}
