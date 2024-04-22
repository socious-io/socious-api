import Router from '@koa/router'
import Mission from '../models/mission/index.js'
import Notif from '../models/notification/index.js'
import Event from '../services/events/index.js'
import Referring from '../models/referring/index.js'
import ImpactPoints from '../services/impact_points/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import Analytics from '../services/analytics/index.js'
import { validate } from '@socious/data'

import { checkIdParams, assigneer, assignee, assigner } from '../utils/middlewares/route.js'
import logger from '../utils/logging.js'

export const router = new Router()

router.get('/:id', loginRequired, checkIdParams, assigneer, async (ctx) => {
  ctx.body = await Mission.get(ctx.mission.id)
})

router.post('/:id/complete', loginRequired, checkIdParams, assignee, async (ctx) => {
  await Mission.complete(ctx.params.id)
  ctx.body = {
    message: 'success'
  }

  const project = ctx.mission.project

  Event.push(Event.Types.NOTIFICATION, ctx.mission.project.identity_id, {
    type: Notif.Types.PROJECT_COMPLETE,
    refId: ctx.mission.id,
    parentId: project.id,
    identity: ctx.identity
  })

  const referred = await Referring.get(ctx.identity.id)
  if (referred) {
    Event.push(Event.Types.NOTIFICATION, referred.referred_by_id, {
      type: Notif.Types.REFERRAL_COMPLETED_JOB,
      refId: ctx.mission.id,
      parentId: ctx.mission.project_id,
      identity: ctx.identity
    })
  }

  Analytics.track({
    userId: ctx.user.id,
    event: 'complete_mission',
    meta: ctx.mission
  })
})

router.post('/:id/submitworks', loginRequired, checkIdParams, assignee, async (ctx) => {
  await validate.SubmitWorkSchema.validateAsync(ctx.request.body)

  await Mission.submitWork({
    ...ctx.request.body,
    mission_id: ctx.mission.id,
    project_id: ctx.mission.project_id
  })
  ctx.body = {
    message: 'success'
  }

  Event.push(Event.Types.NOTIFICATION, ctx.mission.project.identity_id, {
    type: Notif.Types.PROJECT_COMPLETE,
    refId: ctx.mission.id,
    parentId: ctx.mission.project.id,
    identity: ctx.identity
  })

  Analytics.track({
    userId: ctx.user.id,
    event: 'submit_work',
    meta: {
      ...ctx.mission,
      submitted_work: ctx.request.body
    }
  })
})

router.post('/:id/confirm', loginRequired, checkIdParams, assigner, async (ctx) => {
  await Mission.confirm(ctx.params.id)
  ctx.body = {
    message: 'success'
  }

  const project = ctx.mission.project

  Event.push(Event.Types.NOTIFICATION, ctx.mission.assignee_id, {
    type: Notif.Types.ASSIGNER_CONFIRMED,
    refId: ctx.mission.id,
    parentId: project.id,
    identity: ctx.identity
  })

  const orgReferred = await Referring.get(ctx.identity.id)
  if (orgReferred) {
    Event.push(Event.Types.NOTIFICATION, orgReferred.referred_by_id, {
      type: Notif.Types.REFERRAL_CONFIRMED_JOB,
      refId: ctx.mission.id,
      parentId: ctx.mission.project_id,
      identity: ctx.identity
    })
  }

  const userReferred = await Referring.get(ctx.mission.assignee_id)
  if (userReferred) {
    Event.push(Event.Types.NOTIFICATION, userReferred.referred_by_id, {
      type: Notif.Types.REFERRAL_CONFIRMED_JOB,
      refId: ctx.mission.id,
      parentId: ctx.mission.project_id,
      identity: ctx.identity
    })
  }

  if (ctx.identity.meta.verified_impact) ImpactPoints.calculate(ctx.mission)

  Analytics.track({
    userId: ctx.mission.assignee_id,
    event: 'confirmed_mission',
    meta: ctx.mission
  })
})

router.post('/:id/confirm/:work_id', loginRequired, checkIdParams, assigner, async (ctx) => {
  await Mission.confirmWork(ctx.params.work_id)
  ctx.body = {
    message: 'success'
  }

  Event.push(Event.Types.NOTIFICATION, ctx.mission.assignee_id, {
    type: Notif.Types.ASSIGNER_CONFIRMED,
    refId: ctx.mission.id,
    parentId: ctx.mission.project.id,
    identity: ctx.identity
  })

  if (ctx.identity.meta.verified_impact) ImpactPoints.calculate(ctx.mission)

  Analytics.track({
    userId: ctx.user.id,
    event: 'confirm_work',
    meta: {
      ...ctx.mission,
      submitted_work: ctx.request.body
    }
  })
})

router.post('/:id/cancel', loginRequired, checkIdParams, assignee, async (ctx) => {
  await Mission.cancel(ctx.params.id)
  ctx.body = {
    message: 'success'
  }

  const project = ctx.mission.project

  Event.push(Event.Types.NOTIFICATION, ctx.mission.project.identity_id, {
    type: Notif.Types.ASSIGNEE_CANCELED,
    refId: ctx.mission.id,
    parentId: project.id,
    identity: ctx.identity
  })

  Analytics.track({
    userId: ctx.user.id,
    event: 'canceled_mission',
    meta: ctx.mission
  })
})

router.post('/:id/kickout', loginRequired, checkIdParams, assigner, async (ctx) => {
  await Mission.kickout(ctx.params.id)
  ctx.body = {
    message: 'success'
  }

  const project = ctx.mission.project

  Event.push(Event.Types.NOTIFICATION, ctx.mission.assignee_id, {
    type: Notif.Types.ASSIGNER_CANCELED,
    refId: ctx.mission.id,
    parentId: project.id,
    identity: ctx.identity
  })

  Analytics.track({
    userId: ctx.mission.assignee_id,
    event: 'kickedout_mission',
    meta: ctx.mission
  })
})

router.post('/:id/feedback', loginRequired, checkIdParams, assigneer, async (ctx) => {
  if (ctx.identity.meta?.verified_impact) {
    try {
      await ImpactPoints.staticfied(ctx.mission)
    } catch (err) {
      logger.error(err)
    }
  }

  ctx.body = await Mission.feedback({
    content: ctx.request.body.content,
    is_contest: false,
    identity_id: ctx.identity.id,
    project_id: ctx.mission.project_id,
    mission_id: ctx.mission.id
  })
})

router.post('/:id/contest', loginRequired, checkIdParams, assigneer, async (ctx) => {
  if (ctx.identity.meta?.verified_impact) {
    try {
      await ImpactPoints.staticfied(ctx.mission)
    } catch (err) {
      await ImpactPoints.notStaticfied(ctx.mission)
    }
  }

  ctx.body = await Mission.feedback({
    content: ctx.request.body.content,
    is_contest: true,
    identity_id: ctx.identity.id,
    project_id: ctx.mission.project_id,
    mission_id: ctx.mission.id
  })
})
