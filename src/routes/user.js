import Router from '@koa/router'
import Debug from 'debug'
import User from '../models/user/index.js'
import Applicant from '../models/applicant/index.js'
import Auth from '../services/auth/index.js'
import Mission from '../models/mission/index.js'
import Offer from '../models/offer/index.js'
import Skill from '../models/skill/index.js'
import ImpactPoints from '../services/impact_points/index.js'
import { paginate } from '../utils/middlewares/requests.js'
import {
  loginOptional,
  loginRequired
} from '../utils/middlewares/authorization.js'
import { validate } from '@socious/data'
import { checkIdParams } from '../utils/middlewares/route.js'
import { putContact } from '../services/sendgrid/index.js'

export const router = new Router()

router.get('/:id/profile', loginOptional, checkIdParams, async (ctx) => {
  if (ctx.user.status === User.StatusType.INACTIVE) {
    ctx.body = await User.getProfileLimited(ctx.params.id)
    return
  }
  ctx.body = await User.getProfile(ctx.params.id, ctx.identity.id)
})

router.post('/:id/report', loginRequired, async (ctx) => {
  await validate.ReportSchema.validateAsync(ctx.request.body)
  await User.report({
    ...ctx.request.body,
    user_id: ctx.params.id,
    identity_id: ctx.identity.id
  })

  ctx.body = {
    message: 'success'
  }
})

router.get('/by-username/:username/profile', loginOptional, async (ctx) => {
  if (ctx.user.status === User.StatusType.INACTIVE) {
    ctx.body = await User.getProfileByUsernameLimited(ctx.params.username)
    return
  }
  ctx.body = await User.getProfileByUsername(
    ctx.params.username,
    ctx.identity.id
  )
})

router.get('/profile', loginRequired, async (ctx) => {
  ctx.body = await User.getProfile(ctx.user.id)
})

router.post('/update/profile', loginRequired, async (ctx) => {
  await validate.UpdateProfileSchema.validateAsync(ctx.request.body)

  const skills = await Skill.getAllByNames(ctx.request.body.skills)
  ctx.request.body.skills = skills.map((s) => s.name)

  ctx.body = await User.updateProfile(ctx.user.id, ctx.request.body)

  putContact({
    first_name: ctx.body.first_name,
    last_name: ctx.body.last_name,
    email: ctx.body.email
  })
})

router.post('/change-password', loginRequired, async (ctx) => {
  await Auth.changePassword(ctx.user, ctx.request.body)
  ctx.body = {
    message: 'success'
  }
})

router.post('/change-password-direct', loginRequired, async (ctx) => {
  await Auth.directChangePassword(ctx.user, ctx.request.body)

  ctx.body = {
    message: 'success'
  }
})

router.post('/delete', loginRequired, async (ctx) => {
  await User.remove(ctx.user, ctx.request.body.reason)
  ctx.body = {
    message: 'success'
  }
})

router.get(
  '/applicants',
  loginRequired,
  checkIdParams,
  paginate,
  async (ctx) => {
    ctx.body = await Applicant.getByUserId(ctx.user.id, ctx.paginate)
  }
)

router.get('/missions', loginRequired, paginate, async (ctx) => {
  ctx.paginate.filter.assignee_id = ctx.identity.id

  ctx.body = await Mission.getAll(ctx.paginate)
})

router.get('/offers', loginRequired, paginate, async (ctx) => {
  ctx.body = await Offer.getAll(ctx.identity.id, ctx.paginate)
})

router.post('/languages', loginRequired, async (ctx) => {
  await validate.ProfileAddLanguageSchema.validateAsync(ctx.request.body)
  ctx.body = await User.addLanguage(ctx.user, ctx.request.body)
})

router.post(
  '/languages/update/:id',
  loginRequired,
  checkIdParams,
  async (ctx) => {
    await validate.ProfileAddLanguageSchema.validateAsync(ctx.request.body)
    ctx.body = await User.editLanguage(
      ctx.params.id,
      ctx.user,
      ctx.request.body
    )
  }
)

router.post(
  '/languages/remove/:id',
  loginRequired,
  checkIdParams,
  async (ctx) => {
    await validate.ProfileAddLanguageSchema.validateAsync(ctx.request.body)
    ctx.body = await User.removeLanguage(ctx.params.id, ctx.user)
  }
)

router.post('/experiences', loginRequired, async (ctx) => {
  await validate.ProfileExperienceSchema.validateAsync(ctx.request.body)
  ctx.body = await User.addExperience(ctx.user, ctx.request.body)
})

router.post(
  '/experiences/update/:id',
  loginRequired,
  checkIdParams,
  async (ctx) => {
    await validate.ProfileExperienceSchema.validateAsync(ctx.request.body)
    ctx.body = await User.editExperience(
      ctx.params.id,
      ctx.user,
      ctx.request.body
    )
  }
)

router.post(
  '/experiences/remove/:id',
  loginRequired,
  checkIdParams,
  async (ctx) => {
    await validate.ProfileExperienceSchema.validateAsync(ctx.request.body)
    ctx.body = await User.removeExperience(ctx.params.id, ctx.user)
  }
)

router.get('/recommend', loginRequired, async (ctx) => {
  ctx.body = await User.recommend(ctx.user.id)
})

router.get('/badges', loginRequired, async (ctx) => {
  ctx.body = { badges: await ImpactPoints.badges(ctx.identity.id) }
})

router.get('/impact-points', loginRequired, paginate, async (ctx) => {
  ctx.body = await ImpactPoints.history(ctx.identity.id, ctx.paginate)
})
