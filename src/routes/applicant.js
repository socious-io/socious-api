import Router from '@koa/router'
import { validate } from '@socious/data'
import Applicant from '../models/applicant/index.js'
import Offer from '../models/offer/index.js'
import Notif from '../models/notification/index.js'
import Event from '../services/events/index.js'
import Analytics from '../services/analytics/index.js'

import { loginRequired } from '../utils/middlewares/authorization.js'
import { applicantOwner, projectOwner, checkIdParams } from '../utils/middlewares/route.js'
import { BadRequestError } from '../utils/errors.js'

export const router = new Router()

router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Applicant.get(ctx.params.id)
})

router.post('/:id/withdrawn', loginRequired, checkIdParams, applicantOwner, async (ctx) => {
  ctx.body = await Applicant.withdrawn(ctx.params.id)

  Analytics.track({
    userId: ctx.user.id,
    event: 'withdrawn_applicant',
    meta: ctx.applicant
  })
})

router.post('/:id/offer', loginRequired, checkIdParams, projectOwner, async (ctx) => {
  await validate.OfferSchema.validateAsync(ctx.request.body)

  const project = ctx.applicant.project

  await Applicant.offer(ctx.params.id)

  ctx.body = await Offer.send(project.id, {
    ...ctx.request.body,
    recipient_id: ctx.applicant.user_id,
    offerer_id: ctx.identity.id,
    applicant_id: ctx.applicant.id
  })

  Event.push(Event.Types.NOTIFICATION, ctx.applicant.user_id, {
    type: Notif.Types.OFFER,
    refId: ctx.body.id,
    parentId: project.id,
    identity: ctx.identity
  })

  Analytics.track({
    userId: ctx.applicant.user_id,
    event: 'offered_applicant',
    meta: ctx.applicant
  })
})

router.post('/:id/reject', loginRequired, checkIdParams, projectOwner, async (ctx) => {
  await validate.ApplicantRejectSchema.validateAsync(ctx.request.body)
  ctx.body = await Applicant.reject(ctx.params.id, ctx.request.body)

  const project = ctx.applicant.project

  Event.push(Event.Types.NOTIFICATION, ctx.applicant.user_id, {
    type: Notif.Types.REJECT,
    refId: ctx.body.id,
    parentId: project.id,
    identity: ctx.identity
  })

  Analytics.track({
    userId: ctx.applicant.user_id,
    event: 'rejected_applicant',
    meta: ctx.applicant
  })
})

router.post('/reject', loginRequired, async (ctx) => {
  const {
    identity,
    request: {
      body: { applicants, feedback }
    }
  } = ctx

  //Validation
  if (!(applicants && Array.isArray(applicants))) throw new BadRequestError()
  await validate.ApplicantRejectSchema.validateAsync({ feedback })

  const ownedApplicants = await Applicant.projectsOwnerOnPending(identity.id, applicants),
    rejecteeApplicants = ownedApplicants.map((ownedApplicant) => ownedApplicant.id)

  ctx.body = await Applicant.rejectMany(rejecteeApplicants, { feedback })

  for (const ownedApplicant of ownedApplicants) {
    Event.push(Event.Types.NOTIFICATION, ownedApplicant.user_id, {
      type: Notif.Types.REJECT,
      refId: ownedApplicant.id,
      parentId: ownedApplicant.project.id,
      identity
    })
    Analytics.track({
      userId: ownedApplicant.user_id,
      event: 'rejected_applicant',
      meta: ownedApplicants
    })
  }
})

router.post('/update/:id', loginRequired, checkIdParams, applicantOwner, async (ctx) => {
  await validate.ApplicantSchema.validateAsync(ctx.request.body)
  ctx.body = await Applicant.editApply(ctx.params.id, ctx.request.body)
})

router.post('/remove/:id', loginRequired, checkIdParams, applicantOwner, async (ctx) => {
  await Applicant.remove(ctx.params.id)
  ctx.body = {
    message: 'success'
  }

  Analytics.track({
    userId: ctx.applicant.user_id,
    event: 'removed_applicant',
    meta: ctx.applicant
  })
})
