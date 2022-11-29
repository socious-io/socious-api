import Router from '@koa/router';
import Debug from 'debug';
import Auth from '../services/auth/index.js';
import Data from '@socious/data';
import OAuthConnects from '../services/oauth_connects/index.js';
import {loginRequired} from '../utils/middlewares/authorization.js';

export const router = new Router();

const debug = Debug('socious-api:auth');

router.post('/login', async (ctx) => {
  ctx.body = await Auth.basic(ctx.request.body);
});

router.post('/refresh', async (ctx) => {
  const {refresh_token} = ctx.request.body;
  ctx.body = await Auth.refreshToken(refresh_token);
});

router.post('/logout', async (ctx) => {
  const {refresh_token} = ctx.request.body;
  if (refresh_token) await Auth.expireRefreshToken(refresh_token);
  ctx.session = null;
  ctx.body = {message: 'success'};
});

router.post('/web/login', async (ctx) => {
  const response = await Auth.basic(ctx.request.body);
  ctx.session.token = response.access_token;
  ctx.body = {message: 'success'};
});

router.post('/register', async (ctx) => {
  await Auth.register(ctx.request.body);
  ctx.body = {
    message: 'success',
  };
});

router.post('/otp', async (ctx) => {
  await Auth.sendOTP(ctx.request.body);
  ctx.body = {message: 'success'};
});

router.get('/otp/confirm', async (ctx) => {
  ctx.body = await Auth.confirmOTP({
    code: ctx.query.code,
    email: ctx.query.email,
    phone: ctx.query.phone,
  });
});

router.get('/otp/confirm/web', async (ctx) => {
  const response = await Auth.confirmOTP({
    code: ctx.query.code,
    email: ctx.query.email,
    phone: ctx.query.phone,
  });

  ctx.session.token = response.access_token;
  ctx.body = {message: 'success'};
});

router.post('/forget-password', async (ctx) => {
  await Auth.forgetPassword(ctx.request.body);
  ctx.body = {message: 'success'};
});

router.post('/resend-verify-code', async (ctx) => {
  await Auth.resendVerifyCode(ctx.request.body);
  ctx.body = {message: 'success'};
});

router.post('/preregister', async (ctx) => {
  ctx.body = await Auth.preregister(ctx.request.body);
});


router.post('/stripe', loginRequired, async (ctx) => {
  await Data.OAuthStripeSchema.validateAsync(ctx.request.body)
  
  await OAuthConnects.authorize(ctx.identity.id, Data.OAuthProviders.STRIPE, ctx.request.body)
  
})
