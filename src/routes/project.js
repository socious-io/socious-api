import Router from '@koa/router';
import Data, {validate} from '@socious/data';
import Project from '../models/project/index.js';
import Applicant from '../models/applicant/index.js';
import Notif from '../models/notification/index.js';
import Event from '../services/events/index.js';
import {paginate} from '../utils/requests.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {checkIdParams, projectPermission} from '../utils/middlewares/route.js';
import {PermissionError} from '../utils/errors.js';

export const router = new Router();

/**
 * @api {get} /projects/:id Get
 * @apiGroup Project
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription get project
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 * @apiSuccess {String} status
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = await Project.get(ctx.params.id);
});

/**
 * @api {get} /projects Get all
 * @apiGroup Project
 * @apiName Get all
 * @apiVersion 2.0.0
 * @apiDescription get projects
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiQuery {String} identity Filter by owning organization
 *
 * @apiSuccess {Number} page
 * @apiSuccess {Number} limit
 * @apiSuccess {Number} total_count
 * @apiSuccess {Object[]} items
 * @apiSuccess {String} items.id
 * @apiSuccess {String} items.title
 * @apiSuccess {String} items.status
 * @apiSuccess {String} items.description
 * @apiSuccess {Datetime} items.created_at
 * @apiSuccess {Datetime} items.updated_at
 */
router.get('/', loginOptional, paginate, async (ctx) => {
  ctx.body = ctx.query.identity
    ? await Project.allByIdentity(ctx.query.identity, ctx.paginate)
    : await Project.all(ctx.paginate);
});

/**
 * @api {post} /projects Create new
 * @apiGroup Project
 * @apiName Create
 * @apiVersion 2.0.0
 * @apiDescription create new project
 *
 * @apiBody {String} title
 * @apiBody {String} description
 * @apiBody {String} status ('DRAFT', 'EXPIRE', 'ACTIVE')
 * @apiBody {String} payment_type ('VOLUNTEER', 'PAID')
 * @apiBody {String} payment_scheme ('HOURLY', 'FIXED')
 * @apiBody {String} remote_preference ('ONSITE', 'REMOOTE', 'HYBRID')
 * @apiBody {String} payment_currency
 * @apiBody {String} payment_range_lower
 * @apiBody {String} payment_range_higher
 * @apiBody {Number} experience_level
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.post('/', loginRequired, async (ctx) => {
  // only organizations allow to create projects
  if (ctx.identity.type !== Data.IdentityType.ORG) throw new PermissionError();

  await validate.ProjectSchema.validateAsync(ctx.request.body);
  ctx.body = await Project.insert(ctx.identity.id, ctx.request.body);
});

/**
 * @api {post} /projects/update/:id Update
 * @apiGroup Project
 * @apiName Update
 * @apiVersion 2.0.0
 * @apiDescription update project
 *
 * @apiBody {String} title
 * @apiBody {String} description
 * @apiBody {String} status ('DRAFT', 'EXPIRE', 'ACTIVE')
 * @apiBody {String} payment_type ('VOLUNTEER', 'PAID')
 * @apiBody {String} payment_scheme ('HOURLY', 'FIXED')
 * @apiBody {String} remote_preference ('ONSITE', 'REMOOTE', 'HYBRID')
 * @apiBody {String} payment_currency
 * @apiBody {String} payment_range_lower
 * @apiBody {String} payment_range_higher
 * @apiBody {Number} experience_level
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 * @apiSuccess {String} status
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.post(
  '/update/:id',
  loginRequired,
  checkIdParams,
  projectPermission,
  async (ctx) => {
    await validate.ProjectSchema.validateAsync(ctx.request.body);
    ctx.body = await Project.update(ctx.params.id, ctx.request.body);
  },
);

/**
 * @api {get} /projects/:id/questions Get Questions
 * @apiGroup Project
 * @apiName Get Questions
 * @apiVersion 2.0.0
 * @apiDescription get question
 *
 * @apiParam {String} id project id
 *
 * @apiSuccess {Object[]} questions
 * @apiSuccess {String} questions.id
 * @apiSuccess {String} questions.question
 * @apiSuccess {String[]} questions.options
 * @apiSuccess {Boolean} questions.required
 * @apiSuccess {Datetime} questions.created_at
 */

router.get(
  '/:id/questions',
  loginRequired,
  checkIdParams,
  projectPermission,
  async (ctx) => {
    ctx.body = {
      questions: await Project.getQuestions(ctx.params.id),
    };
  },
);

/**
 * @api {post} /projects/:id/questions New Questions
 * @apiGroup Project
 * @apiName New Questions
 * @apiVersion 2.0.0
 * @apiDescription Add new question
 *
 * @apiParam {String} id project id
 *
 * @apiBody {String} question
 * @apiBody {String[]} options
 * @apiBody {Boolean} required
 */
router.post(
  '/:id/questions',
  loginRequired,
  checkIdParams,
  projectPermission,
  async (ctx) => {
    await validate.QuestionSchema.validateAsync(ctx.request.body);
    ctx.body = await Project.addQuestion(ctx.params.id, ctx.request.body);
  },
);

/**
 * @api {post} /projects/questions Get Questions
 * @apiGroup Project
 * @apiName Get Questions
 * @apiVersion 2.0.0
 * @apiDescription get projects
 *
 * @apiBody {String} question
 * @apiBody {String[]} options
 * @apiBody {Boolean} required
 */
router.post(
  '/update/:id/questions/:question_id',
  loginRequired,
  checkIdParams,
  projectPermission,
  async (ctx) => {
    await validate.QuestionSchema.validateAsync(ctx.request.body);
    ctx.body = await Project.updateQuestion(
      ctx.params.question_id,
      ctx.request.body,
    );
  },
);

/**
 * @api {post} /projects/remove/:id Delete
 * @apiGroup Project
 * @apiName Delete
 * @apiVersion 2.0.0
 * @apiDescription delete project
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 */
router.post(
  '/remove/:id',
  loginRequired,
  checkIdParams,
  projectPermission,
  async (ctx) => {
    await Project.remove(ctx.params.id);
    ctx.body = {
      message: 'success',
    };
  },
);

/**
 * @api {get} /projects/:id/applicants Get all applicants
 * @apiGroup Project
 * @apiName GetAllApplicants
 * @apiVersion 2.0.0
 * @apiDescription get applicants by project id
 *
 * @apiParam {String} id
 *
 * @apiSuccess {Number} page
 * @apiSuccess {Number} limit
 * @apiSuccess {Number} total_count
 * @apiSuccess {Object[]} items
 * @apiSuccess {String} items.cover_letter
 * @apiSuccess {String} items.status
 * @apiSuccess {String} items.asignment_total
 * @apiSuccess {String} items.due_date
 * @apiSuccess {String} items.feedback
 * @apiSuccess {String} items.payment_type
 * @apiSuccess {String} items.payment_rate
 * @apiSuccess {String} items.offer_rate
 * @apiSuccess {String} items.offer_message
 * @apiSuccess {String} itmes.project_id
 * @apiSuccess {String} items.user_id
 * @apiSuccess {Datetime} items.created_at
 * @apiSuccess {Datetime} items.updated_at
 */
router.get(
  '/:id/applicants',
  loginRequired,
  paginate,
  checkIdParams,
  async (ctx) => {
    ctx.body = await Applicant.getByProjectId(ctx.params.id, ctx.paginate);
  },
);

/**
 * @api {post} /projects/:id/applicants Apply
 * @apiGroup Project
 * @apiName Apply
 * @apiVersion 2.0.0
 * @apiDescription apply to project
 *
 * @apiParam {String} id project id
 *
 * @apiBody {String} cover_letter
 * @apiBody {String} payment_type
 * @apiBody {String} payment_rate
 * @apiBody {Object[]} answers
 * @apiBody {String} answers.id
 * @apiBody {String} answers.answer
 * @apiBody {Number} answers.selected_option
 *
 * @apiSuccess {String} status
 * @apiSuccess {String} cover_letter
 * @apiSuccess {String} asignment_total
 * @apiSuccess {String} due_date
 * @apiSuccess {String} feedback
 * @apiSuccess {String} payment_type
 * @apiSuccess {String} payment_rate
 * @apiSuccess {String} offer_rate
 * @apiSuccess {String} offer_message
 * @apiSuccess {String} project_id
 * @apiSuccess {String} user_id
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 * @apiSuccess {Object[]} answers
 * @apiSuccess {String} answers.id
 * @apiSuccess {String} answers.answer
 * @apiSuccess {Number} answers.selected_option
 */
router.post('/:id/applicants', loginRequired, checkIdParams, async (ctx) => {
  await validate.ApplicantSchema.validateAsync(ctx.request.body);

  ctx.body = await Applicant.apply(
    ctx.params.id,
    ctx.user.id,
    ctx.request.body,
  );

  const project = await Project.get(ctx.body.project_id);

  Event.push(Event.Types.NOTIFICATION, project.identity_id, {
    type: Notif.Types.APPLICATION,
    refId: ctx.body.id,
    identity: ctx.identity,
  });
});
