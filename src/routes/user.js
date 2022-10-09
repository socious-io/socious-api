import Router from '@koa/router';
import Debug from 'debug';
import User from '../models/user/index.js';
import Applicant from '../models/applicant/index.js';
import Auth from '../services/auth/index.js';
import Skill from '../models/skill/index.js';
import {paginate} from '../utils/requests.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {validate} from '@socious/data';
import {checkIdParams} from '../utils/middlewares/route.js';

export const router = new Router();

const debug = Debug('socious-api:user');

router.get('/:id/profile', loginOptional, checkIdParams, async (ctx) => {
  if (ctx.user.status === User.StatusType.INACTIVE) {
    ctx.body = await User.getProfileLimited(ctx.params.id);
    return;
  }
  ctx.body = await User.getProfile(ctx.params.id);
});

router.get('/by-username/:username/profile', loginOptional, async (ctx) => {
  if (ctx.user.status === User.StatusType.INACTIVE) {
    ctx.body = await User.getProfileByUsernameLimited(ctx.params.username);
    return;
  }
  ctx.body = await User.getProfileByUsername(ctx.params.username);
});

router.get('/profile', loginRequired, async (ctx) => {
  ctx.body = await User.currentProfile(ctx.user);
});

router.post('/update/profile', loginRequired, async (ctx) => {
  await validate.UpdateProfileSchema.validateAsync(ctx.request.body);
  const skills = await Skill.getAllByNames(ctx.request.body.skills);
  ctx.request.body.skills = skills.map((s) => s.name);
  ctx.body = await User.updateProfile(ctx.user.id, ctx.request.body);
});

router.post('/change-password', loginRequired, async (ctx) => {
  await Auth.changePassword(ctx.user, ctx.request.body);
  ctx.body = {
    message: 'success',
  };
});

router.post('/change-password-direct', loginRequired, async (ctx) => {
  await Auth.directChangePassword(ctx.user, ctx.request.body);

  ctx.body = {
    message: 'success',
  };
});

router.post('/delete', loginRequired, async (ctx) => {
  await User.remove(ctx.user, ctx.request.body.reason);
  ctx.body = {
    message: 'success',
  };
});

router.get(
  '/:id/applicants',
  loginRequired,
  checkIdParams,
  paginate,
  async (ctx) => {
    ctx.body = await Applicant.getByUserId(ctx.params.id, ctx.paginate);
  },
);
