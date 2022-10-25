import Router from '@koa/router';
import Data, {validate} from '@socious/data';
import Project from '../models/project/index.js';
import Applicant from '../models/applicant/index.js';
import Notif from '../models/notification/index.js';
import Employed from '../models/employed/index.js';
import Event from '../services/events/index.js';
import {paginate} from '../utils/requests.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {checkIdParams, projectPermission} from '../utils/middlewares/route.js';
import {PermissionError} from '../utils/errors.js';

export const router = new Router();

router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = await Project.get(ctx.params.id, ctx.user.id);
});

router.get('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Project.all(ctx.paginate);
});

router.post('/', loginRequired, async (ctx) => {
  // only organizations allow to create projects
  if (ctx.identity.type !== Data.IdentityType.ORG) throw new PermissionError();

  await validate.ProjectSchema.validateAsync(ctx.request.body);
  ctx.body = await Project.insert(ctx.identity.id, ctx.request.body);
});

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

router.get(
  '/:id/applicants',
  loginRequired,
  paginate,
  checkIdParams,
  async (ctx) => {
    ctx.body = await Applicant.getByProjectId(ctx.params.id, ctx.paginate);
  },
);

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
    parentId: project.id,
    identity: ctx.identity,
  });
});

router.get(
  '/:id/employees',
  loginRequired,
  checkIdParams,
  paginate,
  async (ctx) => {
    ctx.body = await Employed.employees(
      ctx.identity.id,
      ctx.params.id,
      ctx.paginate,
    );
  },
);

router.get(
  '/:id/feedbacks',
  loginRequired,
  checkIdParams,
  paginate,
  async (ctx) => {
    ctx.body = await Employed.feedbacks(ctx.params.id, ctx.paginate);
  },
);
