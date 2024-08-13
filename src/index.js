import Koa from 'koa'
import http from 'http'
import compress from 'koa-compress'
import morgan from 'koa-morgan'
import pg from 'pg'
import { DBCircuitBreaker } from './utils/circuitbreaker.js'
import socket from './utils/socket.js'
import blueprint from './routes/index.js'

import middlewares from './utils/middlewares/site.js'
import { koaLogger } from './utils/logging.js'
import Config from './config.js'
import * as SearchEngineTriggers from './services/elasticsearch/triggers.js'

/** @type {import('../types/app').IApp} */
export const app = new Koa({ proxy: true })

//Search
if (Config.env != 'testing') {
  const SearchEngineClient = (await import('./services/elasticsearch/client.js')).default
  const SearchEngineService = (await import('./services/elasticsearch/service.js'))
  app.searchClient = SearchEngineClient
  app.use((ctx, next) => {
    ctx.searchTriggers = SearchEngineTriggers
    ctx.searchClient = SearchEngineClient
    ctx.searchService = SearchEngineService
    return next()
  })
}

app.keys = [Config.secret]
app.users = {}
app.use(koaLogger)
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]', {
    skip(req, _) {
      return /^\/ping/.exec(req.url)
    }
  })
)
app.use(compress())
app.silent = true

// configure the database via environment, see:
// https://www.postgresql.org/docs/9.1/libpq-envars.html
app.db = new DBCircuitBreaker(new pg.Pool())
app.db.pool.on('error', (err) => {
  console.error('Unexpected database error on idle client', err)
  process.exit(-1)
})

app.use(middlewares(app))

blueprint(app)

app.http = http.createServer(app.callback())

socket(app)

app.listen = (...args) => {
  app.http.listen.call(app.http, ...args)
  return app.http
}
