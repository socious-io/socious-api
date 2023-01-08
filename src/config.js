import {config} from 'dotenv';

const envFile = process.env.ENV === 'testing' ? 'test.env' : '.env';

config({path: envFile});

export default {
  env: process.env.ENV || 'development',
  debug: process.env.DEBUG || false,
  port: normalizePort(process.env.PORT),
  secret: process.env.SECRET,
  jwtExpireTime: '2d',
  jwtRefreshExpireTime: '30d',
  geoipDb: process.env.GEOIP_DB || 'mini-geoip.mmdb',
  sendgridApiKey: process.env.MAIL_SENDGRID_API_KEY,
  segmentAnalytics: process.env.SEGMENT_ANALYTICS || 'test',
  mail: {
    sendgrid: {
      from: {
        email: process.env.MAIL_SENDGRID_FROM || 'team@socious.io',
        name: process.env.MAIL_SENDGRID_NAME || 'Socious Team',
      },
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
    allowTest: boolVariable(process.env.ALLOW_TEST_EMAILS),
    defaultSender: process.env.EMAIL_SENDER ?? 'SENDGRID',
    templates: {
      activation: 'd-d242926eac4e4c33a166764638cf6e7f',
      forgetPassword: 'd-d7aea3b78df042e8a2fdc83953960259',
      otp: 'd-0146441b623f4cb78833c50eb1a8c813',
      notifications: {
        FOLLOWED: 'd-7c4f194c10f14c099a201c403668c6bb',
        COMMENT_LIKE: 'd-7c4f194c10f14c099a201c403668c6bb',
        POST_LIKE: 'd-7c4f194c10f14c099a201c403668c6bb',
        CHAT: 'd-7c4f194c10f14c099a201c403668c6bb',
        SHARE_POST: 'd-7c4f194c10f14c099a201c403668c6bb',
        SHARE_PROJECT: 'd-7c4f194c10f14c099a201c403668c6bb',
        COMMENT: 'd-7c4f194c10f14c099a201c403668c6bb',
        APPLICATION: 'd-7c4f194c10f14c099a201c403668c6bb',
        OFFER: 'd-7c4f194c10f14c099a201c403668c6bb',
        REJECT: 'd-7c4f194c10f14c099a201c403668c6bb',
        APPROVED: 'd-7c4f194c10f14c099a201c403668c6bb',
        HIRED: 'd-7c4f194c10f14c099a201c403668c6bb',
        PROJECT_COMPLETE: 'd-7c4f194c10f14c099a201c403668c6bb',
        ASSIGNEE_CANCELED: 'd-7c4f194c10f14c099a201c403668c6bb',
        ASSIGNER_CANCELED: 'd-7c4f194c10f14c099a201c403668c6bb',
        ASSIGNER_CONFIRMED: 'd-7c4f194c10f14c099a201c403668c6bb',
        CONNECT: 'd-7c4f194c10f14c099a201c403668c6bb',
        ACCEPT_CONNECT: 'd-7c4f194c10f14c099a201c403668c6bb',
        MEMBERED: 'd-7c4f194c10f14c099a201c403668c6bb',
      }
    }
  },
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    db: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
  nats: {
    servers: process.env.NATS_HOSTS?.split(','),
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
    origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(
      ',',
    ),
  },
  payments: {
    stripe: {
      secret_key: process.env.STRIPE_SECRET_KEY,
    },
  },
  idealist: {
    wait_between_project: process.env.WAIT_BETWEEN_PROJECT || '500',
    wait_break: process.env.WAIT_BREAK || 1000,
  },
  notifAppLink:
    process.env.NOTIF_APP_LINK || 'https://socious.io/app/notifications',
};

function boolVariable(val, defaultVal = true) {
  if (val === '') return false;
  if (val === 'false') return false;
  if (val === 'true') return true;
  return defaultVal;
}

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
