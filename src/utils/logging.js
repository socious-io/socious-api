import winston from 'winston'
import { Papertrail } from 'winston-papertrail'
import newrelicFormatter from '@newrelic/winston-enricher'
import Config from '../config.js'
// import Transport from 'winston-transport'

const newrelicWinstonFormatter = newrelicFormatter(winston)

const transports = [new winston.transports.Console()]

// add papertrail logger when it needs
if (Config.papertrail.host) {
  transports.push(
    new Papertrail({
      host: Config.papertrail.host,
      port: Config.papertrail.port
    })
  )
}

const logger = winston.createLogger({
  level: 'info',
  format: newrelicWinstonFormatter(),
  transports
})

export const koaLogger = async (ctx, next) => {
  const start = new Date()

  ctx.logger = logger

  await next()

  const ms = new Date() - start

  let msg = `${ctx.method} | ${ctx.originalUrl} | ${JSON.stringify(ctx.request.header)} | ${ctx.status} | ${ms}ms`

  let logLevel

  if (ctx.status >= 100) {
    logLevel = 'info'
  }
  if (ctx.status >= 400) {
    msg += ` | ${JSON.stringify(ctx.body)}`
    logLevel = 'warn'
  }
  if (ctx.status >= 500) {
    msg += ` | ${JSON.stringify(ctx.body)}`
    logLevel = 'error'
  }

  logger.log(logLevel, msg)
}

export default logger
