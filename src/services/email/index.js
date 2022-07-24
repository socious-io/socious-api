import {insert} from './write.js';
import nodeMailer from 'nodemailer';
import config from '../../config.js';
import ejs from 'ejs';

const defaultMailFrom = `"${config.mail_smtp.from_name}" <${config.mail_smtp.from}>`;
const smtp = nodeMailer.createTransport(config.mail_smtp);

export const MailSenderTypes = {
  SMTP: 'SMTP',
};

export const sendHtmlEmail = async ({
  to,
  subject,
  template,
  from = defaultMailFrom,
  kwargs = {},
  sender = MailSenderTypes.SMTP,
}) => {
  const html = await ejs.renderFile(template, kwargs);
  let result = {};
  try {
    // TODO: Other types would switch with MailSenderTypes
    result = await smtp.sendMail({to, from, subject, html});
  } catch (e) {
    // TODO: better error handler and retry system
    console.log(e);
    return;
  }

  await insert(
    result.messageId,
    {
      service: sender,
      template,
      kwargs,
    },
    result,
  );
};
