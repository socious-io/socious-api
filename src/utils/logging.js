import winston from 'winston'
import axios from 'axios'
import Transport from 'winston-transport'
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

class DiscordTransporter extends Transport {
  constructor(opts) {
    super(opts)
    this.webhookURL = opts.webhookURL
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    if (info.status === 500) {
      axios
        .post(this.webhookURL, {
          content: `Status: ${info.status}, Message: ${info.message}`
        })
        .catch((error) => {
          console.error('Error sending message:', error)
        })
    }

    callback()
  }
}
if (!Config.debug && Config.discordLogger) transports.push(new DiscordTransporter({ webhookURL: Config.discordLogger }))

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

  let msg = `${ctx.method} | ${ctx.originalUrl} | ${JSON.stringify(ctx.request.header)} | ${
    ctx.status
  } | ${JSON.stringify(ctx.request.body)} | ${ms}ms`

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

  logger.log(logLevel, msg, { status: ctx.status })
}

export default logger
