import {insert} from './write.js';
import nodeMailer from 'nodemailer';
import sendgrid from '@sendgrid/mail';
import config from '../../config.js';
import ejs from 'ejs';
import crypto from 'crypto';
import logger from '../../utils/logging.js';

const smtp = nodeMailer.createTransport(config.mail.smtp);
sendgrid.setApiKey(config.sendgridApiKey);

export const MailSenderTypes = {
  SMTP: 'SMTP',
  SENDGRID: 'SENDGRID',
  TEST: 'TEST',
};

// reference: https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml or RFC6761
export const testDomains = [
  'example',
  'example.com',
  'example.net',
  'example.org',
  'invalid',
  'local',
  'localhost',
  'test',
];

export const isTestEmail = (address) => {
  const domain = address.split('@')[1];
  if (!domain) throw new Error('Invalid email');
  for (const td of testDomains) {
    if (td === domain) return true;
    if (domain.endsWith(`.${domain}`)) return true;
  }
  return false;
};

const sendTemplateBySendgrid = async ({to, subject, template, kwargs={}}) => {
  const body = {
    personalizations: [
      {
        to: [{email: to}],
        dynamic_template_data: kwargs,
      }
    ],
    template_id: template,
    subject,
    from: config.mail.sendgrid.from,
  };

  const result = await sendgrid.send(body);

  logger.info(JSON.stringify(result));

  return body;
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

  const result = await sendgrid.send(body);

  logger.info(JSON.stringify(result));

  return body;
};

export const sendHtmlEmail = async ({to, subject, template, kwargs = {}}) => {
  const html = await ejs.renderFile(template, kwargs);
  const date = new Date();
  const sender = isTestEmail(to) ? MailSenderTypes.TEST : config.mail.defaultSender;
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
      case MailSenderTypes.TEST:
        result = null;
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
    result?.messageId || crypto.randomUUID(),
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


export const sendTemplateEmail = async ({to, subject, template, kwargs = {}}) => {
  const sender = isTestEmail(to) ? MailSenderTypes.TEST: config.mail.defaultSender;
  const date = new Date();
  let result = {};
  try {
    switch (sender) {
      case MailSenderTypes.TEST:
        result = null;
        break;
      default:
        result = await sendTemplateBySendgrid({
          to,
          from: config.mail.sendgrid.from,
          subject,
          template,
          kwargs
        });
    }
  } catch (err) {
    logger.error(err);
    return;
  }

  await insert(
    result?.messageId || crypto.randomUUID(),
    {
      service: sender,
      template,
      kwargs,
    },
    result,
    to,
    subject,
    `${Object.keys(kwargs).map(key => `${key}=${kwargs[key]}`).join("&")}`,
    template,
    sender,
    date,
  );
};
