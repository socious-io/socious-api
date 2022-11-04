import {insert} from './write.js';
import nodeMailer from 'nodemailer';
import sendgrid from '@sendgrid/mail';
import config from '../../config.js';
import ejs from 'ejs';
import crypto from 'crypto';
import logger from '../../utils/logging.js';

const smtp = nodeMailer.createTransport(config.mail.smtp);
sendgrid.setApiKey(config.mail.sendgrid.apiKey);

export const MailSenderTypes = {
  SMTP: 'SMTP',
  SENDGRID: 'SENDGRID',
};

const sendBySendgrid = async ({to, subject, html}) => {
  const body = {
    personalizations: [{to: [{email: to}]}],
    subject,
    from: config.mail.sendgrid.from,
    content: [
      {
        type: 'text/html',
        value: html,
      },
    ],
  };

  await sendgrid.send(body);

  return body;
};

export const sendHtmlEmail = async ({
  to,
  subject,
  template,
  kwargs = {},
  sender = MailSenderTypes.SENDGRID,
}) => {
  const html = await ejs.renderFile(template, kwargs);
  const date = new Date();
  let result = {};
  try {
    switch (sender) {
      case MailSenderTypes.SMTP:
        result = await smtp.sendMail({
          to,
          from: config.mail.smtp.from,
          subject,
          html,
          date,
        });
        break;
      case MailSenderTypes.SENDGRID:
        result = await sendBySendgrid({
          to,
          from: config.mail.sendgrid.from,
          subject,
          html,
        });
        break;
      default:
        throw Error(`Unkonw sender type ${sender}`);
    }
  } catch (err) {
    // TODO: better error handler and retry system
    logger.error(err);
    return;
  }

  await insert(
    result.messageId || crypto.randomUUID(),
    {
      service: sender,
      template,
      kwargs,
    },
    result,
    to,
    subject,
    html,
    'text/html',
    sender,
    date,
  );
};
