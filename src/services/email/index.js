import { insert } from './write.js'
import nodeMailer from 'nodemailer'
import config from '../../config.js'
import ejs from 'ejs'
import crypto from 'crypto'
import logger from '../../utils/logging.js'
import { get_identity_sent } from './read.js'

const smtp = nodeMailer.createTransport(config.mail.smtp)

export const MailSenderTypes = {
  SMTP: 'SMTP',
  TEST: 'TEST'
}

// reference: https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml or RFC6761
export const testDomains = [
  'example',
  'example.com',
  'example.net',
  'example.org',
  'invalid',
  'local',
  'localhost',
  'test'
]

export const isTestEmail = (address) => {
  const domain = address.split('@')[1]
  if (!domain) throw new Error('Invalid email')
  for (const td of testDomains) {
    if (td === domain) return true
    if (domain.endsWith(`.${domain}`)) return true
  }
  return false
}

const sendViaSmtp = async ({ to, subject, html }) => {
  return smtp.sendMail({
    to,
    from: config.mail.smtp.from,
    subject,
    html,
    date: new Date()
  })
}

export const sendHtmlEmail = async ({ to, subject, template, kwargs = {} }) => {
  const html = await ejs.renderFile(template, kwargs)
  const date = new Date()
  const sender = isTestEmail(to) ? MailSenderTypes.TEST : config.mail.defaultSender
  let result = {}
  try {
    switch (sender) {
      case MailSenderTypes.SMTP:
        result = await sendViaSmtp({ to, subject, html })
        break
      case MailSenderTypes.TEST:
        result = null
        break
      default:
        throw Error(`Unknown sender type ${sender}`)
    }
  } catch (err) {
    // TODO: better error handler and retry system
    logger.error(err)
    return
  }

  await insert(
    result?.messageId || crypto.randomUUID(),
    {
      service: sender,
      template,
      kwargs
    },
    result,
    to,
    subject,
    html,
    'text/html',
    sender,
    date
  )
}

export const sendTemplateEmail = async ({ to, subject, template, kwargs = {}, category }) => {
  const sender = isTestEmail(to) ? MailSenderTypes.TEST : config.mail.defaultSender
  const date = new Date()
  let result = {}
  let html = ''
  try {
    switch (sender) {
      case MailSenderTypes.TEST:
        result = null
        break
      default:
        html = await ejs.renderFile(template, kwargs)
        result = await sendViaSmtp({ to, subject, html })
    }
  } catch (err) {
    logger.error(`[tmp_email] => ${err.message}`)
    return
  }

  await insert(
    result?.messageId || crypto.randomUUID(),
    {
      service: sender,
      template,
      kwargs
    },
    result,
    to,
    subject,
    html || `${Object.keys(kwargs).map((key) => `${key}=${kwargs[key]}`).join('&')}`,
    template,
    sender,
    date
  )
}

export const identitySendEmails = async ({ to, identity_id, template, kwargs = {}, type }) => {
  const sender = isTestEmail(to) ? MailSenderTypes.TEST : config.mail.defaultSender
  const rows = await get_identity_sent({ identity_id, email: to, type })
  if (rows.length > 0) {
    logger.info(`email to ${to} canceled cause it's already sent less than 2 weeks ago ${JSON.stringify(kwargs)}`)
    return
  }
  let result = {}
  try {
    switch (sender) {
      case MailSenderTypes.TEST:
        result = null
        break
      default: {
        const html = await ejs.renderFile(template, kwargs)
        result = await sendViaSmtp({ to, subject: 'You\'re invited to Socious!', html })
      }
    }
    return result
  } catch (err) {
    logger.error(`[tmp_email] => ${err.message}`)
    return
  }
}
