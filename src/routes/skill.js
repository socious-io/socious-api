import Router from '@koa/router'
import Skill from '../models/skill/index.js'
import { loginOptional } from '../utils/middlewares/authorization.js'
import { paginate } from '../utils/middlewares/requests.js'

export const router = new Router()

router.get('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Skill.all(ctx.paginate)
})
