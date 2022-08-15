import Router from '@koa/router';
import Project from '../models/project/index.js';
import Applicant from '../models/applicant/index.js';
import {paginate, identity} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /projects/:id Get
 * @apiGroup Project
 * @apiName Get
 * @apiVersion 1.0.0
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
router.get('/:id', async (ctx) => {
  ctx.body = await Project.get(ctx.params.id);
});

/**
 * @api {get} /projects Get all
 * @apiGroup Project
 * @apiName Get all
 * @apiVersion 1.0.0
 * @apiDescription get projects
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1, max:50}} limit default 10
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
router.get('/', paginate, async (ctx) => {
  ctx.body = await Project.all(ctx.paginate);
});

/**
 * @api {post} /projects Create new
 * @apiGroup Project
 * @apiName Create
 * @apiVersion 1.0.0
 * @apiDescription create new project
 *
 * @apiBody {String} title
 * @apiBody {String} description
 * @apiBody {String} status ('DRAFT', 'EXPIRE', 'ACTIVE')
 * @apiBody {String} payment_type ('VOLUNTEER', 'PAID')
 * @apiBody {String} payment_scheme ('HOURLY', 'FIXED')
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
router.post('/', identity, async (ctx) => {
  ctx.body = await Project.insert(ctx.identity.id, ctx.request.body);
});

/**
 * @api {put} /projects/:id Update
 * @apiGroup Project
 * @apiName Update
 * @apiVersion 1.0.0
 * @apiDescription update project
 *
 * @apiBody {String} title
 * @apiBody {String} description
 * @apiBody {String} status ('DRAFT', 'EXPIRE', 'ACTIVE')
 * @apiBody {String} payment_type ('VOLUNTEER', 'PAID')
 * @apiBody {String} payment_scheme ('HOURLY', 'FIXED')
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
router.put('/:id', identity, async (ctx) => {
  await Project.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Project.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {delete} /projects/:id Delete
 * @apiGroup Project
 * @apiName Delete
 * @apiVersion 1.0.0
 * @apiDescription delete project
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 */
router.delete('/:id', identity, async (ctx) => {
  await Project.permissioned(ctx.identity.id, ctx.params.id);
  await Project.remove(ctx.params.id);
  ctx.body = {message: 'success'};
});

/**
 * @api {get} /projects/:id/applicants Get all applicants
 * @apiGroup Project
 * @apiName GetAllApplicants
 * @apiVersion 1.0.0
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
router.get('/:id/applicants', paginate, async (ctx) => {
  ctx.body = await Applicant.getByProjectId(ctx.params.id, ctx.paginate);
});

/**
 * @api {get} /projects/applicants/:id Get applicant
 * @apiGroup Project
 * @apiName GetApplicants
 * @apiVersion 1.0.0
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
router.get('/applicants/:id', async (ctx) => {
  ctx.body = await Applicant.get(ctx.params.id);
});

/**
 * @api {post} /projects/:id/applicants Apply
 * @apiGroup Project
 * @apiName Apply
 * @apiVersion 1.0.0
 * @apiDescription apply to project
 *
 * @apiParam {String} id
 *
 * @apiBody {String} cover_letter
 * @apiBody {String} payment_type
 * @apiBody {String} payment_rate
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
router.post('/:id/applicants', async (ctx) => {
  ctx.body = await Applicant.insert(
    ctx.params.id,
    ctx.user.id,
    ctx.request.body,
  );
});

/**
 * @api {put} /projects/applicants/:id/withdraw Withdraw Application
 * @apiGroup Project
 * @apiName WithdrawApplicant
 * @apiVersion 1.0.0
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
router.put('/applicants/:id/withdraw', async (ctx) => {
  await Applicant.mustOwner(ctx.user.id, ctx.params.id);
  ctx.body = await Applicant.withdraw(ctx.params.id);
});

/**
 * @api {put} /projects/applicants/:id/offer Offer Applicant
 * @apiGroup Project
 * @apiName OfferApplicant
 * @apiVersion 1.0.0
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
router.put('/applicants/:id/offer', identity, async (ctx) => {
  await Applicant.mustProjectOwner(ctx.identity.id, ctx.params.id);
  ctx.body = await Applicant.offer(ctx.params.id, ctx.request.body);
});

/**
 * @api {put} /projects/applicants/:id/reject Reject Applicant
 * @apiGroup Project
 * @apiName RejectApplicant
 * @apiVersion 1.0.0
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
router.put('/applicants/:id/reject', identity, async (ctx) => {
  await Applicant.mustProjectOwner(ctx.identity.id, ctx.params.id);
  ctx.body = await Applicant.reject(ctx.params.id, ctx.request.body);
});

/**
 * @api {put} /projects/applicants/:id/approve Approve Offer
 * @apiGroup Project
 * @apiName ApproveOffer
 * @apiVersion 1.0.0
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
router.put('/applicants/:id/approve', identity, async (ctx) => {
  await Applicant.mustOwner(ctx.identity.id, ctx.params.id);
  ctx.body = await Applicant.approve(ctx.params.id);
});

/**
 * @api {put} /projects/applicants/:id Update Applicant
 * @apiGroup Project
 * @apiName UpdateApplicant
 * @apiVersion 1.0.0
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
router.put('/applicants/:id', async (ctx) => {
  await Applicant.mustOwner(ctx.user.id, ctx.params.id);
  ctx.body = await Applicant.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {delete} /projects/applicants/:id Remove Applicant
 * @apiGroup Project
 * @apiName RemoveApplicant
 * @apiVersion 1.0.0
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
router.delete('/applicants/:id', identity, async (ctx) => {
  await Applicant.mustOwner(ctx.user.id, ctx.params.id);
  await Applicant.remove(ctx.params.id);
  ctx.body = {message: 'success'};
});
