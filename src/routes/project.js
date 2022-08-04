import Router from '@koa/router';
import Project from '../models/project/index.js';
import {paginate, identity} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /project/findby-projectid/:id Get
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
router.get('/findby-projectid/:id', async (ctx) => {
  ctx.body = await Project.get(ctx.params.id);
});

/**
 * @api {get} /project/findby-pageid/:page_id Get
 * @apiGroup Project
 * @apiName Get
 * @apiVersion 1.0.0
 * @apiDescription get project
 *
 * @apiParam {String} page_id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
 router.get('/findby-pageid/:page_id', async (ctx) => {
  ctx.body = await Project.getByPageId(ctx.params.page_id);
});

/**
 * @api {get} /project/get-all Get all
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
router.get('/get-all', paginate, async (ctx) => {
  ctx.body = await Project.all(ctx.paginate);
});

/**
 * @api {post} /project/create-project Create new
 * @apiGroup Project
 * @apiName Create
 * @apiVersion 1.0.0
 * @apiDescription create new project
 *
 * @apiBody {String} title
 * @apiBody {String} description
 *
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.post('/create-project', async (ctx) => {
  ctx.body = await Project.insert(ctx.request.body);
});

/**
 * @api {put} /project/update-project/:id Update
 * @apiGroup Post
 * @apiName Update
 * @apiVersion 1.0.0
 * @apiDescription update post
 *
 * @apiBody {String} title
 * @apiBody {String} description
 *
 * @apiParam {String} id
 *
 * @apiSuccess {String} id
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 * @apiSuccess {Datetime} created_at
 * @apiSuccess {Datetime} updated_at
 */
router.put('/update-project/:id', async (ctx) => {
  ctx.body = await Project.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {delete} /project/delete-project/:id Delete
 * @apiGroup Project
 * @apiName Delete
 * @apiVersion 1.0.0
 * @apiDescription delete project
 *
 *
 * @apiParam {String} id
 */
router.delete('/delete-project/:id', async (ctx) => {
  await Project.remove(ctx.params.id);
  ctx.body = {message: 'success'};
});
