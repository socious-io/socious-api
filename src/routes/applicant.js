import Router from '@koa/router';
import {validate} from '@socious/data';
import Applicant from '../models/applicant/index.js';
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
  },
);


router.post('/:id/approve', loginRequired, applicantOwner, async (ctx) => {
  ctx.body = await Applicant.approve(ctx.params.id);
});

router.post('/:id/hire', loginRequired, projectOwner, async (ctx) => {
  if (
    ctx.applicant.project.total_escrow_amount <= ctx.aapplicant.assignment_total
  )
    throw new PermissionError();
  ctx.body = await Applicant.hire(ctx.params.id);
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
