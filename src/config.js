import { config } from 'dotenv'

const envFile = process.env.ENV === 'testing' ? 'test.env' : '.env'

config({ path: envFile })

export default {
  serverName: process.env.SERVER_NAME || 'localhost',
  env: process.env.ENV || 'development',
  debug: process.env.DEBUG || false,
  port: normalizePort(process.env.PORT),
  secret: process.env.SECRET,
  jwtExpireTime: '2d',
  jwtRefreshExpireTime: '30d',
  geoipDb: process.env.GEOIP_DB || 'mini-geoip.mmdb',
  sendgridApiKey: process.env.MAIL_SENDGRID_API_KEY,
  segmentAnalytics: process.env.SEGMENT_ANALYTICS || 'test',
  slack: {
    enabled: process.env.SLACK_ENABLED || true,
    token: process.env.SLACK_TOKEN || 'test',
    logChannel: process.env.SLACK_LOG_CHANNEL || 'test'
  },
  mail: {
    sendgrid: {
      from: {
        email: process.env.MAIL_SENDGRID_FROM || 'team@socious.io',
        name: process.env.MAIL_SENDGRID_NAME || 'Socious Team'
      },
      otp_from: {
        email: process.env.MAIL_SENDGRID_FROM || 'no-replay@socious.io',
        name: process.env.MAIL_SENDGRID_NAME || 'Socious'
      }
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
        pass: process.env.MAIL_SMTP_PASS
      }
    },
    allowTest: boolVariable(process.env.ALLOW_TEST_EMAILS),
    defaultSender: process.env.EMAIL_SENDER ?? 'SENDGRID',
    templates: {
      activation: 'd-d242926eac4e4c33a166764638cf6e7f',
      forgetPassword: 'd-d7aea3b78df042e8a2fdc83953960259',
      otp: 'd-0146441b623f4cb78833c50eb1a8c813',
      notifications: {
        FOLLOWED: 'd-aeeec637f91f418388bf9b5ce40e94c2',
        COMMENT_LIKE: 'd-ce5fc950a83642d78c32c305d56acd9a',
        POST_LIKE: 'd-0033451102e4419bb277c067d27076fb',
        CHAT: 'd-f074d0d0ac95496ca3717d5369f1d013',
        SHARE_POST: 'd-9911d673f11d4a2ea7552a037caf4d6f',
        SHARE_PROJECT: 'd-d330640808de4ff298798e3715663bb9',
        COMMENT: 'd-0ccebf87a2954f0dbcb9e03ba6cd678c',
        APPLICATION: 'd-d0e56e66b2354defadc55a1922f6f00c',
        OFFER: 'd-f43f679352b947bb8af7d95101e37086',
        REJECT: 'd-dc4cb57947284a5cb2c3c33abbafb96b',
        APPROVED: 'd-f46c948afada4dc5862d751b7480364b',
        HIRED: 'd-8d94367eacb5411fb6188a8ba06363df',
        PROJECT_COMPLETE: 'd-731d6e77e1b4412d8e7b8fbbc7f418db',
        ASSIGNEE_CANCELED: 'd-0df6e8629f644986b2d6ff9b758058bc',
        ASSIGNER_CANCELED: 'd-65e541665d20410d806089be8fa4d4d9',
        ASSIGNER_CONFIRMED: 'd-c8701ca45acc4922a6551575953952d4',
        CONNECT: 'd-fbdf106885cf43699af6ce4d7d7b27da',
        ACCEPT_CONNECT: 'd-a4a688a2513f41a1bbae531abdc269b5',
        MEMBERED: 'd-7bb68df4ca12457b9d4f403977565443'
      }
    }
  },
  ai: {
    job_recommender_url: process.env.AI_JOBS_RECOMMENDER_URL
  },
  services: {
    proofspace: {
      credentialId: process.env.PROOFSPACE_CREDENTIAL_ID,
      schemaId: process.env.PROOFSPACE_SCHEMA_ID,
      serviceId: process.env.PROOFSPACE_SERVICE_ID,
      webhookKey: process.env.PROOFSPACE_WEBHOOK_KEY
    }
  },
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    db: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  },
  nats: {
    servers: process.env.NATS_HOSTS?.split(','),
    token: process.env.NATS_TOKEN
  },
  session: {
    key: 'Socious.sess',
    maxAge: 140 * 60 * 60 * 1000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : null
  },
  webhooks: {
    token: process.env.WEBHOOKS_TOKEN || 'test_secret_token',
    addr: process.env.WEBHOOKS_ADDR || 'http://localhost:8370/webhooks'
  },
  requestBlocker: {
    // We may tagname blocker configs and use it on other groups and routes
    auth: {
      resetTimer: process.env.AUTH_REQUEST_BLOCKER_RESET || 60 * 1000,
      blockerTimer: process.env.AUTH_REQUEST_BLOCKER_TIMER || 2 * 60 * 60 * 1000,
      retryCount: process.env.AUTH_REQUEST_BLOCKER_COUNTER || 10
    }
  },
  aws: {
    cdn_url: process.env.AWS_CDN_URL || 'https://socious-new.s3.ap-northeast-1.amazonaws.com',
    bucket: process.env.AWS_BUCKET || 'socious-new',
    key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION || 'ap-northeast-1'
  },
  socket: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  },
  fcm: {
    key: process.env.FCM_KEY
  },
  papertrail: {
    host: process.env.PAPERTRAIL_HOST,
    port: process.env.PAPERTRAIL_PORT
  },
  crypto: {
    usd_convertor: {
      '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9': { rate: 0.33 }
    },
    env: process.env.CRYPTO_ENV || 'testnet',
    networks: {
      testnet: [
        {
          chain: {
            name: 'milkomeda testnet',
            explorer: 'https://explorer-devnet-cardano-evm.c1.milkomeda.com/api'
          },
          escrow: '0xAC87EDb9209E9637549c43fA9Ca267b4d4577959',
          tokens: [
            {
              name: 'USDC',
              symbol: 'USDC',
              address: '0xC12F6Ee5c853393105f29EF0310e61e6B494a70F',
              decimals: 6
            }
          ]
        },
        {
          chain: {
            name: 'bsc testnet',
            explorer: 'https://api.bscscan.com/api'
          },
          escrow: '0xE6b7fdf37b4D297d7E4BcB055Df06AF5DDbf82Ce',
          tokens: [
            {
              name: 'USDC',
              symbol: 'USDC',
              address: '0x082A2027DC16F42d6e69bE8FA13C94C17c910EbE',
              decimals: 18
            },
            {
              name: 'USDT',
              symbol: 'USDT',
              address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
              decimals: 18
            }
          ]
        },
        {
          chain: {
            name: 'mumbai',
            explorer: 'https://mumbai.polygonscan.com/api'
          },
          escrow: '0x6141408AdB801e6C657Db14b9b1410B3a4a07935',
          tokens: [
            {
              name: 'USDC',
              symbol: 'USDC',
              address: '0x057e82120fc16ddDAF8B1Fb697ab5506f8874B6e',
              decimals: 18
            }
          ]
        },
        {
          chain: {
            name: 'shasta',
            explorer: 'https://api.shasta.trongrid.io/v1',
            tron: true
          },
          escrow: 'ChangeMe',
          tokens: [
            {
              name: 'USDC',
              symbol: 'USDC',
              address: 'ChangeMe',
              decimals: 6
            }
          ]
        }
      ],
      mainet: [
        {
          chain: {
            name: 'milkomeda',
            explorer: 'https://explorer-mainnet-cardano-evm.c1.milkomeda.com/api'
          },
          escrow: '0xF2B4BCc3F1687288a8c0c06Ee720350CA09dfb23',
          tokens: [
            {
              name: 'USD Coin',
              symbol: 'USDC',
              address: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
              decimals: 6
            },
            {
              name: 'USD Coin',
              symbol: 'mUSDC',
              address: '0x063139a927FE02B3a6A5E0d5B48c8BeDFA7de954',
              decimals: 6
            },
            {
              name: 'Tether',
              symbol: 'USDT',
              address: '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844',
              decimals: 6
            },
            {
              name: 'Dai',
              symbol: 'DAI',
              address: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
              decimals: 6
            },
            {
              name: 'Djed',
              symbol: 'SC',
              address: '0xbfB54440448e6b702fa2A1d7033cd5fB0d9C5A27',
              decimals: 6
            },
            {
              name: 'Wrapped ADA',
              symbol: 'WADA',
              address: '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9',
              decimals: 18
            }
          ]
        },
        {
          chain: {
            name: 'polygon',
            explorer: 'https://api.polygonscan.com/api'
          },
          escrow: '0x057e82120fc16ddDAF8B1Fb697ab5506f8874B6e',
          tokens: [
            {
              name: 'USD Coin',
              symbol: 'USDC',
              address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
              decimals: 6
            },
            {
              name: 'Tether',
              symbol: 'USDT',
              address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
              decimals: 6
            },
            {
              name: 'Dai',
              symbol: 'DAI',
              address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
              decimals: 6
            }
          ]
        },
        {
          chain: {
            name: 'bsc',
            explorer: ''
          },
          escrow: '0x057e82120fc16ddDAF8B1Fb697ab5506f8874B6e',
          tokens: [
            {
              name: 'USD Coin',
              symbol: 'USDC',
              address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
              decimals: 18
            },
            {
              name: 'Tether',
              symbol: 'USDT',
              address: '0x55d398326f99059fF775485246999027B3197955',
              decimals: 18
            }
          ]
        }
      ]
    }
  },
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',')
  },
  payments: {
    stripe: {
      secret_key: process.env.STRIPE_SECRET_KEY,
      connect_redirect: process.env.STRIPE_CONNECT_REDIRECT || 'https://socious.io/api/v2/auth/stripe',
      client_connect_link: process.env.STRIPE_CLIENT_CONNECT_LINK || 'https://webapp2.socious.io/wallet'
    },
    stripe_jp: {
      secret_key: process.env.STRIPE_JP_SECRET_KEY,
      connect_redirect: process.env.STRIPE_CONNECT_REDIRECT || 'https://socious.io/api/v2/auth/stripe',
      client_connect_link: process.env.STRIPE_CLIENT_CONNECT_LINK || 'https://webapp2.socious.io/wallet'
    }
  },
  idealist: {
    wait_between_project: process.env.WAIT_BETWEEN_PROJECT || '500',
    wait_break: process.env.WAIT_BREAK || 1000
  },
  notifAppLink: process.env.NOTIF_APP_LINK || 'https://app.socious.io/notifications',
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  discordLogger: process.env.DISCORD_LOGGER
}

/**
 *
 * @param val
 * @param defaultVal
 * @example
 */
function boolVariable(val, defaultVal = true) {
  if (val === '') return false
  if (val === 'false') return false
  if (val === 'true') return true
  return defaultVal
}

/**
 * Normalize a port into a number, string, or false.
 */

/**
 *
 * @param val
 * @example
 */
function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}
