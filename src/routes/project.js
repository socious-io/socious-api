import Router from '@koa/router'
import Data, { validate } from '@socious/data'
import Project from '../models/project/index.js'
import Applicant from '../models/applicant/index.js'
import Notif from '../models/notification/index.js'
import Mission from '../models/mission/index.js'
import Offer from '../models/offer/index.js'
import Event from '../services/events/index.js'
import { paginate } from '../utils/middlewares/requests.js'
import { loginOptional, loginRequired } from '../utils/middlewares/authorization.js'
import { checkIdParams, projectPermission } from '../utils/middlewares/route.js'
import { ConflictError, PermissionError } from '../utils/errors.js'
import Analytics from '../services/analytics/index.js'
import { recommendProjectByProject } from '../services/recommender/index.js'
export const router = new Router()

router.get('/mark', loginRequired, paginate, async (ctx) => {
  const { identity, paginate } = ctx
  ctx.body = await Project.getAllWithMarksByIdentity(identity.id, paginate)
})

router.get('/categories', async (ctx) => {
  ctx.body = { categories: await Project.jobCategories() }
})

router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  const optionals = {
    userId: ctx.user.id,
    identityId: ctx.identity.id
  }
  ctx.body = await Project.get(ctx.params.id, optionals)
})

router.get('/', loginOptional, paginate, async (ctx) => {
  const optionals = {
    identityId: ctx.identity.id
  }
  ctx.body = await Project.all(ctx.paginate, optionals)
})

router.post('/', loginRequired, async (ctx) => {
  // only organizations allow to create projects
  if (ctx.identity.type !== Data.IdentityType.ORG) throw new PermissionError()

  await validate.ProjectSchema.validateAsync(ctx.request.body)
  ctx.body = await Project.insert(ctx.identity.id, ctx.request.body)
})

router.post('/update/:id', loginRequired, checkIdParams, projectPermission, async (ctx) => {
  await validate.ProjectSchema.validateAsync(ctx.request.body)
  ctx.body = await Project.update(ctx.params.id, ctx.request.body)
})

router.post('/update/:id/close', loginRequired, checkIdParams, projectPermission, async (ctx) => {
  ctx.body = await Project.close(ctx.params.id)
})

router.get('/:id/questions', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = {
    questions: await Project.getQuestions(ctx.params.id)
  }
})

router.post('/:id/questions', loginRequired, checkIdParams, projectPermission, async (ctx) => {
  await validate.QuestionSchema.validateAsync(ctx.request.body)
  ctx.body = await Project.addQuestion(ctx.params.id, ctx.request.body)
})

router.post('/:id/questions/batch', loginRequired, checkIdParams, projectPermission, async (ctx) => {
  const questions = ctx.request.body,
    addedQuestions = [],
    projectId = ctx.params.id

  for (const question of questions) await validate.QuestionSchema.validateAsync(question)
  for (const question of questions) addedQuestions.push(await Project.addQuestion(projectId, question))
  ctx.body = addedQuestions
})

router.post('/update/:id/questions/:question_id', loginRequired, checkIdParams, projectPermission, async (ctx) => {
  await validate.QuestionSchema.validateAsync(ctx.request.body)
  ctx.body = await Project.updateQuestion(ctx.params.question_id, ctx.request.body)
})

router.post('/remove/:id/questions/:question_id', loginRequired, checkIdParams, projectPermission, async (ctx) => {
  await Project.removeQuestion(ctx.params.question_id)
  ctx.body = { message: 'success' }
})

router.post('/remove/:id', loginRequired, checkIdParams, projectPermission, async (ctx) => {
  await Project.remove(ctx.params.id)
  ctx.body = {
    message: 'success'
  }
})

router.get('/:id/applicants', loginRequired, paginate, checkIdParams, async (ctx) => {
  ctx.body = await Applicant.getByProjectId(ctx.params.id, ctx.paginate)
})

router.post('/:id/applicants', loginRequired, checkIdParams, async (ctx) => {
  await validate.ApplicantSchema.validateAsync(ctx.request.body)
  ctx.body = await Applicant.apply(ctx.params.id, ctx.user.id, ctx.request.body)
  const project = await Project.get(ctx.body.project_id)

  Event.push(Event.Types.NOTIFICATION, project.identity_id, {
    type: Notif.Types.APPLICATION,
    refId: ctx.body.id,
    parentId: project.id,
    identity: ctx.identity
  })

  Analytics.track({
    userId: ctx.params.user_id,
    event: 'applied_project',
    meta: ctx.body
  })
})

router.get('/:id/missions', loginRequired, checkIdParams, paginate, async (ctx) => {
  ctx.paginate.filter.project_id = ctx.params.id
  ctx.paginate.filter.assigner_id = ctx.identity.id

  ctx.body = await Mission.getAll(ctx.paginate)
})

router.get('/:id/offers', loginRequired, checkIdParams, projectPermission, paginate, async (ctx) => {
  ctx.paginate.filter.project_id = ctx.params.id

  ctx.body = await Offer.getAll(ctx.identity.id, ctx.paginate)
})

router.post('/:id/offer/:user_id', loginRequired, checkIdParams, projectPermission, async (ctx) => {
  await validate.OfferSchema.validateAsync(ctx.request.body)

  ctx.body = await Offer.send(ctx.params.id, {
    ...ctx.request.body,
    recipient_id: ctx.params.user_id,
    offerer_id: ctx.identity.id
  })

  Event.push(Event.Types.NOTIFICATION, ctx.params.user_id, {
    type: Notif.Types.OFFER,
    refId: ctx.body.id,
    parentId: ctx.params.id,
    identity: ctx.identity
  })

  Analytics.track({
    userId: ctx.params.user_id,
    event: 'offered_project',
    meta: ctx.project
  })
})

router.get('/:id/feedbacks', loginRequired, checkIdParams, paginate, async (ctx) => {
  ctx.body = await Mission.feedbacks(ctx.params.id, ctx.paginate)
})

router.get('/:id/similars', loginOptional, checkIdParams, paginate, async (ctx) => {
  ctx.body = await recommendProjectByProject(ctx.params.id)
})

router.post('/:id/mark', loginRequired, checkIdParams, async (ctx) => {
  const {
    query: { mark_as },
    params,
    identity
  } = ctx

  const mark = await Project.getMarkByIdentityAndTypeAndProjectId(params.id, identity.id, mark_as)
  if (mark[0]) throw new ConflictError()

  ctx.body = await Project.addMark(params.id, identity.id, mark_as)
})

router.post('/:id/mark/delete', loginOptional, checkIdParams, async (ctx) => {
  const {
    params: { id },
    identity
  } = ctx

  await Project.removeMark(identity.id, id)

  ctx.body = {
    status: 'OK'
  }
})
