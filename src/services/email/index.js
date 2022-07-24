import {insert} from './write.js';
import nodeMailer from 'nodemailer';
import config from '../../config.js';
import ejs from 'ejs';

const defaultMailFrom = `"${config.mail_smtp.from_name}" <${config.mail_smtp.from}>`;
const smtp = nodeMailer.createTransport(config.mail_smtp);

export const SMTP = 'SMTP';

export const MailSender = {
  SMTP: {func: smtp.sendMail, name: 'SMTP'},
};

export const sendHtmlEmail = async ({
  to,
  subject,
  template,
  from = defaultMailFrom,
  kwargs = {},
  service = SMTP,
}) => {
  const sender = MailSender[service];
  const html = await ejs.renderFile(template, kwargs);

  const result = await sender.func({to, from, subject, html});

  await insert(
    result.messageId,
    {
      service: sender.name,
      template,
      kwargs,
    },
    result,
  );
};
