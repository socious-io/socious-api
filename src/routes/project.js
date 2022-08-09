import Router from '@koa/router';
import Project from '../models/project/index.js';
import Applicant from '../models/applicant/index.js';
import {paginate, identity} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /projects/applicant/:id Get
 * @apiGroup Applicant
 * @apiName Get
 * @apiVersion 1.0.0
 * @apiDescription get applicant
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} project_id
 * @apiSuccess {String} user_id
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
 router.get('/applicant/:id', async (ctx) => {
  ctx.body = await Applicant.get(ctx.params.id);
});

/**
 * @api {get} /projects/applicant Get all
 * @apiGroup Applicant
 * @apiName Get
 * @apiVersion 1.0.0
 * @apiDescription get applicants
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1, max:50}} limit default 10
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} project_id
 * @apiSuccess {String} user_id
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.get('/applicant', paginate, async (ctx) => {
  ctx.body = await Applicant.all(ctx.paginate);
});

/**
 * @api {post} /projects/applicant Create new
 * @apiGroup Applicant
 * @apiName Create
 * @apiVersion 1.0.0
 * @apiDescription create new applicant
 *
 * @apiBody {String} project_id
 * @apiBody {String} user_id
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} project_id
 * @apiSuccess {String} user_id
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.post('/applicant', identity, async (ctx) => {
  ctx.body = await Applicant.insert(ctx.identity.id, ctx.request.body);
});

/**
 * @api {put} /projects/applicant/:id Update
 * @apiGroup Applicant
 * @apiName Update
 * @apiVersion 1.0.0
 * @apiDescription update applicant
 *
 * @apiBody {String} project_id
 * @apiBody {String} user_id
 * 
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} project_id
 * @apiSuccess {String} user_id
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.put('/applicant/:id', identity, async (ctx) => {
  await Applicant.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Applicant.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {delete} /projects/applicant/:id Delete
 * @apiGroup Applicant
 * @apiName Delete
 * @apiVersion 1.0.0
 * @apiDescription delete applicant
 * 
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 */
router.delete('/applicant/:id', identity, async (ctx) => {
  await Applicant.permissioned(ctx.identity.id, ctx.params.id);
  await Applicant.remove(ctx.params.id);
  ctx.body = {message: 'success'};
});

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
 * 
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} title
 * @apiSuccess {String} description
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
 * @api {get} /projects/:id/applicants set session
 * @apiGroup Project
 * @apiName GetByProjectId
 * @apiVersion 1.0.0
 * @apiDescription get applicants by project id
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} project_id
 * @apiSuccess {String} user_id
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
 router.get('/:id/applicants', paginate, async (ctx) => {
  ctx.body = await Applicant.getByProjectId(ctx.params.id, ctx.paginate);
});
