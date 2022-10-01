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

/**
 * @api {get} /applicants/:id Get applicant
 * @apiGroup Applicant
 * @apiName GetApplicants
 * @apiVersion 2.0.0
 * @apiDescription get applicant by id
 *
 * @apiParam {String} id
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
 */
router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Applicant.get(ctx.params.id);
});

/**
 * @api {post} /applicants/:id/withdraw Withdraw Application
 * @apiGroup Applicant
 * @apiName WithdrawApplicant
 * @apiVersion 2.0.0
 * @apiDescription withdraw application; must be applicant (owner)
 *
 * @apiParam {String} id
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
 */
router.post(
  '/:id/withdraw',
  loginRequired,
  checkIdParams,
  applicantOwner,
  async (ctx) => {
    ctx.body = await Applicant.withdraw(ctx.params.id);
  },
);

/**
 * @api {post} /applicants/:id/offer Offer Applicant
 * @apiGroup Applicant
 * @apiName OfferApplicant
 * @apiVersion 2.0.0
 * @apiDescription offer for applicant must be project owner
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiBody {String} offer_rate
 * @apiBody {String} offer_message
 * @apiBody {Number} assignment_total
 * @apiBody {Datetime} due_date
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
 */
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

/**
 * @api {post} /applicants/applicants/:id/reject Reject Applicant
 * @apiGroup Applicant
 * @apiName RejectApplicant
 * @apiVersion 2.0.0
 * @apiDescription offer for applicant must be project owner
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiBody {String} feedback
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
 */
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

/**
 * @api {post} /applicants/applicants/:id/approve Approve Offer
 * @apiGroup Applicant
 * @apiName ApproveOffer
 * @apiVersion 2.0.0
 * @apiDescription approve offer must be applicant owner
 *
 * @apiParam {String} id
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
 */
router.post('/:id/approve', loginRequired, applicantOwner, async (ctx) => {
  ctx.body = await Applicant.approve(ctx.params.id);
});

/**
 * @api {post} /applicants/applicants/:id/approve Approve Offer
 * @apiGroup Applicant
 * @apiName ApproveOffer
 * @apiVersion 2.0.0
 * @apiDescription approve offer must be applicant owner
 *
 * @apiParam {String} id
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
 */
router.post('/:id/hire', loginRequired, projectOwner, async (ctx) => {
  if (
    ctx.applicant.project.total_escrow_amount <= ctx.aapplicant.assignment_total
  )
    throw new PermissionError();
  ctx.body = await Applicant.hire(ctx.params.id);
});

/**
 * @api {post} /applicants/applicants/:id Update Applicant
 * @apiGroup Applicant
 * @apiName UpdateApplicant
 * @apiVersion 2.0.0
 * @apiDescription approve offer must be applicant owner
 *
 * @apiParam {String} id applicant
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

/**
 * @api {post} /applicants/remove/applicants/:id Remove Applicant
 * @apiGroup Applicant
 * @apiName RemoveApplicant
 * @apiVersion 2.0.0
 * @apiDescription approve offer must be applicant owner
 *
 * @apiParam {String} id
 *
 */
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
