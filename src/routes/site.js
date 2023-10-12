import Config from '../config.js'
import Router from '@koa/router'
import Project from '../models/project/index.js'
import Post from '../models/post/index.js'
import Org from '../models/organization/index.js'
import User from '../models/user/index.js'
import Applicant from '../models/applicant/index.js'
import Offer from '../models/offer/index.js'
import Mission from '../models/mission/index.js'
import { loginOptional } from '../utils/middlewares/authorization.js'
import { PermissionError } from '../utils/errors.js'
import publish from '../services/jobs/publish.js'
import ejs from 'ejs'
import { checkIdParams } from '../utils/middlewares/route.js'
import { paginateCTX } from '../utils/middlewares/requests.js'

export const router = new Router()

router.get('/options', loginOptional, async (ctx) => {
  ctx.body = {
    projects: {
      filter_columns: Object.keys(Project.filterColumns),
      sort_columns: Project.sortColumns
    },
    posts: {
      filter_columns: Object.keys(Post.filterColumns),
      sort_columns: Post.sortColumns
    },
    organizations: {
      filter_columns: Object.keys(Org.filterColumns),
      sort_columns: Org.sortColumns
    },
    users: {
      filter_columns: Object.keys(User.filterColumns),
      sort_columns: User.sortColumns
    },
    applicants: {
      filter_columns: Object.keys(Applicant.filterColumns),
      sort_columns: Applicant.sortColumns
    },
    missions: {
      filter_columns: Object.keys(Mission.filterColumns),
      sort_columns: Mission.sortColumns
    },
    offers: {
      filter_columns: Object.keys(Offer.filterColumns),
      sort_columns: Offer.sortColumns
    }
  }
})

router.post('/publish', loginOptional, async (ctx) => {
  if (ctx.request.header['secret-key'] !== Config.secret) throw new PermissionError()

  publish(ctx.request.body.name, ctx.request.body.data)

  ctx.body = {
    message: 'success'
  }
})

router.get('/jobs', loginOptional, paginateCTX, async (ctx) => {
  const jobs = await Project.all(ctx.paginate)
  if (jobs.length > 0) {
    ctx.paginate.total_count = parseInt(jobs[0].total_count)
    ctx.paginate.total_pages = ctx.paginate.total_count / ctx.paginate.limit
  } else {
    ctx.paginate.total_count = 0
    ctx.paginate.total_pages = 0
  }
  console.log(ctx.paginate)
  const html = await ejs.renderFile('templates/robots/jobs.html', { jobs, paginate: ctx.paginate })
  ctx.body = html
})

router.get('/jobs/:id', loginOptional, checkIdParams, async (ctx) => {
  const job = await Project.get(ctx.params.id)
  const html = await ejs.renderFile('templates/robots/job.html', { job })
  ctx.body = html
})
