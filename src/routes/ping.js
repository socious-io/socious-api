import Router from '@koa/router'
import axios from 'axios'
import Debug from 'debug'

import config from '../config.js'

const debug = Debug('socious-api:ping')
export const router = new Router()
let abort = false

router.get('/', (ctx) => {
  ctx.body = 'pong'
})

router.get('/remote', async (ctx) => {
  const pingRes = await axios.get(`http://localhost:${config.port}/ping`)
  ctx.body = pingRes.data
})

router.get('/ready', (ctx) => {
  if (abort) {
    debug('not ready')
    ctx.status = 500
    ctx.statusText = ctx.body = 'not ready'
  }
  ctx.body = 'pong'
})

router.get('/abort', (ctx) => {
  abort = true
  debug('abort application')
  ctx.body = 'abort'
})
