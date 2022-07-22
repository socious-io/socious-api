import 'dotenv/config';

export default {
  port: normalizePort(process.env.PORT),
  secret: process.env.SECRET,
  jwtExpireTime: '2h',

  mail_smtp: {
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT ?? 587,
    from: process.env.MAIL_SMTP_FROM ?? 'team@socious.io',
    from_name: process.env.MAIL_SMTP_FROM_NAME ?? 'Socious Team',
    secure: process.env.MAIL_SMTP_SECURE ?? false, // true for 465, false for other ports ref: nodeMailer document
    auth: {
      user: process.env.MAIL_SMTP_USER,
      pass: process.env.MAIL_SMTP_PASS,
    },
  },
};

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
