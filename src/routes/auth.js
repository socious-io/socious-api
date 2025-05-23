import Router from '@koa/router'
import Auth from '../services/auth/index.js'
import User from '../models/user/index.js'
import Data from '@socious/data'
import OAuthConnects from '../services/oauth_connects/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { putContact } from '../services/sendgrid/index.js'
import Analytics from '../services/analytics/index.js'
import config from '../config.js'
import { ValidationError } from '../utils/errors.js'
import logger from '../utils/logging.js'
import Event from '../services/events/index.js'
import Notif from '../models/notification/index.js'
import { googleLogin } from '../services/oauth_connects/google.js'
import Identity from '../models/identity/index.js'
import { appleLogin } from '../services/oauth_connects/apple.js'
import koaBody from 'koa-bodyparser'

export const router = new Router()

router.post('/login', async (ctx) => {
  const { signin, user } = await Auth.basic(ctx.request.body)
  if (ctx.query.event_id) await User.updateUserEvents(user.id, ctx.query.event_id)
  ctx.body = signin
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
  const { signin } = await Auth.basic(ctx.request.body)
  ctx.session.token = signin.access_token
  ctx.body = { message: 'success' }
})

router.post('/register', async (ctx) => {
  const user = await Auth.register(ctx.request.body, ctx.query.referred_by)
  if (ctx.query.event_id) await User.updateUserEvents(user.id, ctx.query.event_id)

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

router.get('/google', async (ctx) => {
  const { platform, code, referrer_by } = ctx.query
  const login = await googleLogin(platform, code, referrer_by, ctx.headers.referer)

  if (login.registered && referrer_by) {
    const identity = await Identity.get(login.user)
    Event.push(Event.Types.NOTIFICATION, referrer_by, {
      type: Notif.Types.REFERRAL_JOINED,
      refId: login.user.id,
      parentId: identity.id,
      identity: identity
    })
  }

  if (ctx.query.event_id) await User.updateUserEvents(login.user.id, ctx.query.event_id)

  ctx.body = {
    ...login.signin,
    registered: login.registered
  }
})

router.post('/apple', koaBody(), async (ctx) => {
  const { code, id_token } = ctx.request.body
  ctx.redirect(`${config.fronthost}/oauth/apple?code=${code}&id_token=${id_token}`)
})

router.get('/apple', async (ctx) => {
  const { code, referrer_by, platform } = ctx.query
  const login = await appleLogin(code, referrer_by, platform, ctx.headers.referer)

  if (login.registered && referrer_by) {
    const identity = await Identity.get(login.user)
    Event.push(Event.Types.NOTIFICATION, referrer_by, {
      type: Notif.Types.REFERRAL_JOINED,
      refId: login.user.id,
      parentId: identity.id,
      identity: identity
    })
  }

  if (ctx.query.event_id) await User.updateUserEvents(login.user.id, ctx.query.event_id)

  ctx.body = {
    ...login.signin,
    registered: login.registered
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
