import Router from '@koa/router';
import Skill from '../models/skill/index.js';
import {paginate} from '../utils/requests.js';

export const router = new Router();

/**
 * @api {get} /skills Get all
 * @apiGroup Skill
 * @apiName GetAll
 * @apiVersion 1.0.0
 * @apiDescription get skills
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1, max:50}} limit default 10
 *
 * @apiSuccess {Number} page
 * @apiSuccess {Number} limit
 * @apiSuccess {Number} total_count
 * @apiSuccess {Object[]} items
 * @apiSuccess {String} items.id
 * @apiSuccess {String} items.name
 * @apiSuccess {Datetime} created_at
 */
router.get('/', paginate, async (ctx) => {
  ctx.body = await Skill.all(ctx.paginate);
});
