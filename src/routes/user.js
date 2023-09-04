import Router from '@koa/router'
import User from '../models/user/index.js'
import Applicant from '../models/applicant/index.js'
import Auth from '../services/auth/index.js'
import Mission from '../models/mission/index.js'
import Offer from '../models/offer/index.js'
import Skill from '../models/skill/index.js'
import ImpactPoints from '../services/impact_points/index.js'
import Payment from '../services/payments/index.js'
import { paginate } from '../utils/middlewares/requests.js'
import { loginOptional, loginRequired } from '../utils/middlewares/authorization.js'
import Data, { validate } from '@socious/data'
import { checkIdParams } from '../utils/middlewares/route.js'
import { putContact } from '../services/sendgrid/index.js'
import { BadRequestError } from '../utils/errors.js'

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
  ctx.body = await User.getProfileByUsername(ctx.params.username, ctx.identity.id)
})

router.get('/profile', loginRequired, async (ctx) => {
  ctx.body = await User.getProfile(ctx.user.id)
})

router.post('/update/wallet', loginRequired, async (ctx) => {
  const wallet = ctx.request.body.wallet_address
  if (!wallet) throw new BadRequestError('wallet address is required')
  await User.updateWalletAddress(ctx.user.id, wallet)
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

router.get('/applicants', loginRequired, checkIdParams, paginate, async (ctx) => {
  ctx.body = await Applicant.getByUserId(ctx.user.id, ctx.paginate)
})

router.get('/:id/missions', loginRequired, checkIdParams, paginate, async (ctx) => {
  ctx.paginate.filter.assignee_id = ctx.params.id
  ctx.body = await Mission.getAll(ctx.paginate)
})

router.get('/missions', loginRequired, paginate, async (ctx) => {
  ctx.paginate.filter.assignee_id = ctx.identity.id

  const missions = await Mission.getAll(ctx.paginate)

  ctx.body = missions.map((m) => {
    return {
      ...m,
      ...Payment.amounts({
        amount: m.offer.assignment_total,
        service: Data.PaymentService.STRIPE
          ? m.offer.payment_mode === Data.PaymentMode.FIAT
          : Data.PaymentService.CRYPTO,
        verified: m.assigner.meta.verified_impact
      })
    }
  })
})

router.get('/offers', loginRequired, paginate, async (ctx) => {
  ctx.body = await Offer.getAll(ctx.identity.id, ctx.paginate)
})

router.post('/languages', loginRequired, async (ctx) => {
  await validate.ProfileAddLanguageSchema.validateAsync(ctx.request.body)
  ctx.body = await User.addLanguage(ctx.user, ctx.request.body)
})

router.post('/languages/update/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.ProfileAddLanguageSchema.validateAsync(ctx.request.body)
  ctx.body = await User.editLanguage(ctx.params.id, ctx.user, ctx.request.body)
})

router.post('/languages/remove/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.ProfileAddLanguageSchema.validateAsync(ctx.request.body)
  ctx.body = await User.removeLanguage(ctx.params.id, ctx.user)
})

router.post('/experiences', loginRequired, async (ctx) => {
  await validate.ProfileExperienceSchema.validateAsync(ctx.request.body)
  ctx.body = await User.addExperience(ctx.user, ctx.request.body)
})

router.post('/experiences/update/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.ProfileExperienceSchema.validateAsync(ctx.request.body)
  ctx.body = await User.editExperience(ctx.params.id, ctx.user, ctx.request.body)
})

router.post('/experiences/remove/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.ProfileExperienceSchema.validateAsync(ctx.request.body)
  ctx.body = await User.removeExperience(ctx.params.id, ctx.user)
})

router.get('/recommend', loginRequired, async (ctx) => {
  ctx.body = await User.recommend(ctx.user.id)
})

router.get('/badges', loginRequired, async (ctx) => {
  ctx.body = { badges: await ImpactPoints.badges(ctx.identity.id) }
})

router.get('/impact-points', loginRequired, paginate, async (ctx) => {
  ctx.body = await ImpactPoints.history(ctx.identity.id, ctx.paginate)
})

router.post('/open-to-work', loginRequired, async (ctx) => {
  ctx.body = {
    open_to_work: await User.openToWork(ctx.user.id)
  }
})

router.post('/open-to-volunteer', loginRequired, async (ctx) => {
  ctx.body = {
    open_to_volunteer: await User.openToVolunteer(ctx.user.id)
  }
})
