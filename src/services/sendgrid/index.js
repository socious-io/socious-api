import config from '../../config.js'
import client from '@sendgrid/client'
import mail from '@sendgrid/mail'
import publish from '../jobs/publish.js'
import logger from '../../utils/logging.js'

client.setApiKey(config.sendgridApiKey)
mail.setClient(client)

export const simpleMail = async ({ to, subject, html }) => {
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    subject,
    from: config.mail.sendgrid.from,
    content: [
      {
        type: 'text/html',
        value: html
      }
    ]
  }

  try {
    const result = await mail.send(body)
    logger.info(JSON.stringify(result))
  } catch (err) {
    logger.error(JSON.stringify(err))
  }

  return body
}

export const putContact = ({ email, city, country, first_name, last_name, meta }) => {
  publish('sendgrid_add_contacts', {
    email,
    city,
    country,
    first_name,
    last_name,
    custom_fields: meta
  })
}

export const contactWorker = async (body) => {
  const request = {
    url: '/v3/marketing/contacts',
    method: 'PUT',
    body: {
      contacts: [body]
    }
  }

  try {
    const result = await client.request(request)
    logger.info(JSON.stringify(result))
  } catch (err) {
    logger.error(JSON.stringify(err))
  }
}
