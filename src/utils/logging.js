import winston from 'winston'
import newrelicFormatter from '@newrelic/winston-enricher'
import Config from '../config.js'
import { WebClient } from '@slack/web-api'
import Transport from 'winston-transport'

const slack = new WebClient(Config.slack.token)

const newrelicWinstonFormatter = newrelicFormatter(winston)

class SlackTransport extends Transport {
  constructor(opts) {
    super(opts)
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    if (info.level !== 'info' && Config.slack.enabled) {
      try {
        await slack.chat.postMessage({
          channel: Config.slack.logChannel,
          text: `${Config.serverName} ::: \n\`\`\`${JSON.stringify(info)}\`\`\``
        })
      } catch (err) {
        console.error('Error sending message to Slack:', err)
      }
    }

    callback()
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: newrelicWinstonFormatter(),
  transports: [new winston.transports.Console(), new SlackTransport()]
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
