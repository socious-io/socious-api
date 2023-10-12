import Router from '@koa/router'
import Auth from '../services/auth/index.js'
import Data from '@socious/data'
import OAuthConnects from '../services/oauth_connects/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { putContact } from '../services/sendgrid/index.js'
import Analytics from '../services/analytics/index.js'
import config from '../config.js'
import { ValidationError } from '../utils/errors.js'
import logger from '../utils/logging.js'

export const router = new Router()

router.post('/login', async (ctx) => {
  ctx.body = await Auth.basic(ctx.request.body)
})

router.post('/refresh', async (ctx) => {
  const { refresh_token } = ctx.request.body
  ctx.body = await Auth.refreshToken(refresh_token)
})

router.post('/logout', async (ctx) => {
  const { refresh_token } = ctx.request.body
  if (refresh_token) await Auth.expireRefreshToken(refresh_token)
  ctx.session = null
  ctx.body = { message: 'success' }
})

router.post('/web/login', async (ctx) => {
  const response = await Auth.basic(ctx.request.body)
  ctx.session.token = response.access_token
  ctx.body = { message: 'success' }
})

router.post('/register', async (ctx) => {
  const user = await Auth.register(ctx.request.body)

  ctx.body = {
    message: 'success'
  }

  putContact({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email
  })

  Analytics.identify({
    userId: user.id,
    email: user.email,
    meta: {
      first_name: user.first_name,
      last_name: user.last_name
    }
  })
})

router.post('/otp', async (ctx) => {
  await Auth.sendOTP(ctx.request.body)
  ctx.body = { message: 'success' }
})

router.get('/otp/confirm', async (ctx) => {
  ctx.body = await Auth.confirmOTP({
    code: ctx.query.code,
    email: ctx.query.email,
    phone: ctx.query.phone
  })
})

router.get('/otp/confirm/web', async (ctx) => {
  const response = await Auth.confirmOTP({
    code: ctx.query.code,
    email: ctx.query.email,
    phone: ctx.query.phone
  })

  ctx.session.token = response.access_token
  ctx.body = { message: 'success' }
})

router.post('/forget-password', async (ctx) => {
  await Auth.forgetPassword(ctx.request.body)
  ctx.body = { message: 'success' }
})

router.post('/resend-verify-code', async (ctx) => {
  await Auth.resendVerifyCode(ctx.request.body)
  ctx.body = { message: 'success' }
})

router.post('/preregister', async (ctx) => {
  ctx.body = await Auth.preregister(ctx.request.body)
})

router.get('/stripe/connect-link', loginRequired, async (ctx) => {
  if (!ctx.query.country) throw new ValidationError('Country need to be selected')

  const { country, is_jp, redirect_url } = ctx.query

  const link = await OAuthConnects.link(ctx.identity.id, Data.OAuthProviders.STRIPE, {
    country,
    is_jp: is_jp === 'true',
    redirect_url
  })
  ctx.body = { link }
})

router.get('/stripe', async (ctx) => {
  const { stripe_account } = ctx.query

  try {
    if (stripe_account) {
      const auth = await OAuthConnects.authorize(Data.OAuthProviders.STRIPE, { stripe_account })
      ctx.status = 301
      ctx.redirect(
        `${auth.redirect_url || config.payments.stripe.client_connect_link}?account=${auth.account_id}&status=${
          auth.status
        }`
      )
    } else {
      throw new ValidationError('stripe account not found')
    }
  } catch (err) {
    ctx.status = 301
    ctx.redirect(`${config.payments.stripe.client_connect_link}?status=failed&error=${err.message}`)
  }
})

router.get('/stripe/profile', loginRequired, async (ctx) => {
  // Success anyway
  try {
    ctx.body = await OAuthConnects.profile(ctx.identity.id, Data.OAuthProviders.STRIPE, {
      is_jp: ctx.query.is_jp === 'true'
    })
  } catch (err) {
    logger.error(`GET STRIPE ACCOUNT ERROR ${err}`)
    ctx.body = {}
  }
})
