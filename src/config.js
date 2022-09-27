import 'dotenv/config';

export default {
  debug: process.env.DEBUG || false,
  port: normalizePort(process.env.PORT),
  secret: process.env.SECRET,
  jwtExpireTime: '2d',
  jwtRefreshExpireTime: '30d',
  mail: {
    sendgrid: {
      from: {
        email: process.env.MAIL_SENDGRID_FROM || 'team@socious.io',
        name: process.env.MAIL_SENDGRID_NAME || 'Socious Team',
      },
      apiKey: process.env.MAIL_SENDGRID_API_KEY,
    },
    smtp: {
      host: process.env.MAIL_SMTP_HOST,
      port: process.env.MAIL_SMTP_PORT ?? 587,
      from: `"${process.env.MAIL_SMTP_FROM_NAME || 'Socious Team'}" <${
        process.env.MAIL_SMTP_FROM || 'team@socious.io'
      }>`,
      secure: process.env.MAIL_SMTP_SECURE ?? false, // true for 465, false for other ports ref: nodeMailer document
      auth: {
        user: process.env.MAIL_SMTP_USER,
        pass: process.env.MAIL_SMTP_PASS,
      },
    },
  },
  nats: {
    servers: process.env.NATS_HOSTS.split(','),
    token: process.env.NATS_TOKEN,
  },
  session: {
    key: 'Socious.sess',
    maxAge: 48 * 60 * 60 * 1000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : null,
  },
  webhooks: {
    token: process.env.WEBHOOKS_TOKEN || 'test_secret_token',
    addr: process.env.WEBHOOKS_ADDR || 'http://localhost:8370/webhooks',
  },
  requestBlocker: {
    // We may tagname blocker configs and use it on other groups and routes
    auth: {
      resetTimer: process.env.AUTH_REQUEST_BLOCKER_RESET || 60 * 1000,
      blockerTimer:
        process.env.AUTH_REQUEST_BLOCKER_TIMER || 2 * 60 * 60 * 1000,
      retryCount: process.env.AUTH_REQUEST_BLOCKER_COUNTER || 10,
    },
  },
  aws: {
    cdn_url:
      process.env.AWS_CDN_URL ||
      'https://soscious.s3.ap-northeast-1.amazonaws.com',
    bucket: process.env.AWS_BUCKET || 'socious',
    key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION || 'ap-northeast-1',
  },
  socket: {},
  fcm: {
    key: process.env.FCM_KEY,
  },
  cors: {
    origins: (process.env.ALLOWED_ORIGINS || 'localhost:3000').split(','),
  },
  payments: {
    stripe: {
      secret_key: process.env.STRIPE_SECRET_KEY
    },
    success_url: process.env.PAYMENT_SUCCESS_URL || 'http://localhost:8370/payments/success',
    cancel_url: process.env.PAYMENT_CANCEL_URL || 'http://localhost:8370/payments/cancel'
  }
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
