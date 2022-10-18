import Router from '@koa/router';
import {validate} from '@socious/data';
import Applicant from '../models/applicant/index.js';
import Notif from '../models/notification/index.js';
import Event from '../services/events/index.js';
import {PermissionError} from '../utils/errors.js';

import {loginRequired} from '../utils/middlewares/authorization.js';
import {
  applicantOwner,
  projectOwner,
  checkIdParams,
} from '../utils/middlewares/route.js';

export const router = new Router();

router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Applicant.get(ctx.params.id);
});

router.post(
  '/:id/withdraw',
  loginRequired,
  checkIdParams,
  applicantOwner,
  async (ctx) => {
    ctx.body = await Applicant.withdraw(ctx.params.id);
  },
);

router.post(
  '/:id/offer',
  loginRequired,
  checkIdParams,
  projectOwner,
  async (ctx) => {
    await validate.ApplicantOfferSchema.validateAsync(ctx.request.body);
    ctx.body = await Applicant.offer(ctx.params.id, ctx.request.body);

    const project = ctx.applicant.project;

    Event.push(Event.Types.NOTIFICATION, ctx.applicant.user_id, {
      type: Notif.Types.OFFER,
      refId: ctx.body.id,
      parentId: project.id,
      identity: ctx.identity,
    });
  },
);

router.post(
  '/:id/reject',
  loginRequired,
  checkIdParams,
  projectOwner,
  async (ctx) => {
    await validate.ApplicantRejectSchema.validateAsync(ctx.request.body);
    ctx.body = await Applicant.reject(ctx.params.id, ctx.request.body);

    const project = ctx.applicant.project;

    Event.push(Event.Types.NOTIFICATION, ctx.applicant.user_id, {
      type: Notif.Types.REJECT,
      refId: ctx.body.id,
      parentId: project.id,
      identity: ctx.identity,
    });
  },
);

router.post('/:id/approve', loginRequired, applicantOwner, async (ctx) => {
  ctx.body = await Applicant.approve(ctx.params.id);

  const project = ctx.applicant.project;

  Event.push(Event.Types.NOTIFICATION, project.identity_id, {
    type: Notif.Types.APPROVED,
    refId: ctx.body.id,
    parentId: project.id,
    identity: ctx.identity,
  });
});

router.post('/:id/hire', loginRequired, projectOwner, async (ctx) => {
  if (
    ctx.applicant.project.total_escrow_amount < ctx.applicant.assignment_total
  )
    throw new PermissionError();
  ctx.body = await Applicant.hire(ctx.params.id);

  const project = ctx.applicant.project;

  Event.push(Event.Types.NOTIFICATION, project.identity_id, {
    type: Notif.Types.APPROVED,
    refId: ctx.body.id,
    parentId: project.id,
    identity: ctx.identity,
  });
});

router.post(
  '/update/:id',
  loginRequired,
  checkIdParams,
  applicantOwner,
  async (ctx) => {
    await validate.ApplicantSchema.validateAsync(ctx.request.body);
    ctx.body = await Applicant.editApply(ctx.params.id, ctx.request.body);
  },
);

router.post(
  '/remove/:id',
  loginRequired,
  checkIdParams,
  applicantOwner,
  async (ctx) => {
    await Applicant.remove(ctx.params.id);
    ctx.body = {
      message: 'success',
    };
  },
);
