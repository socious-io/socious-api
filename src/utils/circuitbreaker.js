import { Policy, ConsecutiveBreaker } from 'cockatiel'
import Debug from 'debug'
import Config from '../config.js'
import { readFile } from 'fs/promises'
import { NotMatchedError } from './errors.js'
const debug = Debug('socious-api:circuitbreaker')

// Create a retry policy that'll try whatever function we execute 3
// times with a randomized exponential backoff.
export const retry = Policy.handleAll().retry().attempts(3).exponential()
retry.onFailure(({ duration, handled, reason }) => {
  debug(`retry call ran in ${duration}ms and failed with`, reason)
  debug(handled ? 'error was handled' : 'error was not handled')
})

// Create a circuit breaker that'll stop calling the executed function for 10
// seconds if it fails 5 times in a row. This can give time for e.g. a database
// to recover without getting tons of traffic.
export const circuitBreaker = Policy.handleAll().circuitBreaker(10 * 1000, new ConsecutiveBreaker(5))
circuitBreaker.onFailure(({ duration, handled, reason }) => {
  debug(`circuit breaker call ran in ${duration}ms and failed with`, reason)
  debug(handled ? 'error was handled' : 'error was not handled')
})

// Combine these! Create a policy that retries 3 times, calling through the circuit breaker
export const retryWithBreaker = Policy.wrap(retry, circuitBreaker)

const policies = {
  none: Policy.noop,
  retry,
  circuitBreaker,
  retryWithBreaker,
  SSO: Policy.wrap(Policy.handleAll().retry().attempts(30).exponential({ initialDelay: 1000 }), circuitBreaker)
}

export const policyByName = (name) => policies[name]

export class DBCircuitBreaker {
  // TODO: chache this with Redis or etc ...
  cache = {}
  constructor(pool, policy) {
    this.pool = pool
    this.policy = policyByName(policy || process.env.DEFAULT_DB_CIRCUIT_BREAKER || 'none')
  }

  async getQueryFromFile(name) {
    if (this.cache[name] && Config.debug === false) return this.cache[name]

    const query = await readFile(`src/sql/${name}.sql`)
    this.cache[name] = query.toString()
    return this.cache[name]
  }

  async execute(name, args, kwargs = {}) {
    let q = await this.getQueryFromFile(name)
    // Note: kwargs are unsafe
    Object.keys(kwargs).map((k) => {
      q = q.replaceAll(`{{${k}}}`, kwargs[k])
    })
    return this.query(q, args)
  }

  query(...args) {
    return this.policy.execute(() => this.pool.query(...args))
  }

  //handling pg_notify(event, data) here
  on(event, callback) {
    return this.policy.execute(() => {
      const tryConnect = () => {
        this.pool.connect((err, client, done) => {
          if (err) {
            console.error(`Error connecting to the database: (event: ${event})`, err);
            // Retry connection after 5 second
            return setTimeout(tryConnect, 5000);
          }
  
          console.log(`Successfully connected to the database (event: ${event})`);
          
          // Flag to ensure client is only released once
          let clientReleased = false;
  
          // Listen for notifications
          client.on('notification', callback);
          
          // Handle client errors
          client.on('error', (error) => {
            if (!clientReleased) {
              console.error(`Client error occurred (event: ${event}):`, error);
              done(); // Release client back to pool
              clientReleased = true; // Mark client as released
            }
            // Retry connection after 5 second
            setTimeout(tryConnect, 5000);
          });
  
          // Reconnect when connection is ended
          client.on('end', () => {
            if (!clientReleased) {
              console.log(`Client connection ended (event: ${event})`);
              done(); // Release client
              clientReleased = true; // Mark client as released
            }
            // Retry connection after 5 second
            setTimeout(tryConnect, 5000);
          });
  
          // Execute LISTEN query for the event
          client.query(`LISTEN ${event}`, (queryErr) => {
            if (queryErr) {
              console.error(`Error executing LISTEN query (event: ${event}):`, queryErr);
              if (!clientReleased) {
                done(); // Release client if LISTEN query fails
                clientReleased = true; // Mark client as released
              }
              // Retry connection after 5 second
              setTimeout(tryConnect, 5000);
            } else {
              console.log(`Listening for ${event} events`);
            }
          });
        });
      };
  
      // Start the connection attempt
      tryConnect();
    });
  }

  async get(...args) {
    const { rows } = await this.query(...args)
    if (rows.length < 1) throw new NotMatchedError()
    return rows[0]
  }

  async with(fn) {
    const client = await this.pool.connect()
    try {
      return fn({
        client,
        query: (...args) => {
          return this.policy.execute(() => client.query(...args))
        },
        async get(...args) {
          const { rows } = await this.query(...args)
          if (rows.length < 1) throw new NotMatchedError()
          return rows[0]
        }
      })
    } finally {
      client.release()
    }
  }
}
