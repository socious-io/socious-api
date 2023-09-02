import Router from '@koa/router'
import { validate } from '@socious/data'
import Org from '../models/organization/index.js'
import { loginOptional, loginRequired } from '../utils/middlewares/authorization.js'
import { checkIdParams, orgMember } from '../utils/middlewares/route.js'
import { paginate } from '../utils/middlewares/requests.js'
import { ValidationError } from '../utils/errors.js'
import config from '../config.js'
import { isTestEmail } from '../services/email/index.js'
import Notif from '../models/notification/index.js'
import Event from '../services/events/index.js'

export const router = new Router()

router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = await Org.get(ctx.params.id)
})

router.get('/by-shortname/:shortname', loginOptional, async (ctx) => {
  ctx.body = await Org.getByShortname(ctx.params.shortname)
})

router.get('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Org.all(ctx.paginate)
})

router.post('/', loginRequired, async (ctx) => {
  await validate.OrganizationSchema.validateAsync(ctx.request.body)
  if (!config.mail.allowTest && isTestEmail(ctx.request.body.email)) {
    throw new ValidationError('Invalid email')
  }
  ctx.body = await Org.insert(ctx.user.id, ctx.request.body)
  await Org.addMember(ctx.body.id, ctx.user.id)
})

router.get('/check', loginRequired, async (ctx) => {
  ctx.body = {
    shortname_exists: await Org.shortNameExists(ctx.query.shortname)
  }
})

router.post('/update/:id', loginRequired, checkIdParams, orgMember, async (ctx) => {
  await validate.OrganizationSchema.validateAsync(ctx.request.body)
  if (!config.mail.allowTest && isTestEmail(ctx.request.body.email)) {
    throw new ValidationError('Invalid email')
  }
  await Org.update(ctx.params.id, ctx.request.body)
  ctx.body = await Org.get(ctx.params.id)
})

router.get('/:id/members', loginRequired, checkIdParams, paginate, async (ctx) => {
  ctx.body = await Org.members(ctx.params.id, ctx.paginate)
})

router.post('/:id/members/:user_id', loginRequired, checkIdParams, orgMember, async (ctx) => {
  await Org.addMember(ctx.params.id, ctx.params.user_id)
  ctx.body = { message: 'success' }

  Event.push(Event.Types.NOTIFICATION, ctx.params.user_id, {
    type: Notif.Types.MEMBERED,
    refId: ctx.params.user_id,
    parentId: ctx.params.id,
    identity: ctx.identity
  })
})

router.post('/remove/:id/members/:user_id', loginRequired, checkIdParams, orgMember, async (ctx) => {
  await Org.removeMember(ctx.params.id, ctx.params.user_id)
  ctx.body = { message: 'success' }
})

router.post('/hiring', loginRequired, async (ctx) => {
  ctx.body = {
    hiring: await Org.hiring(ctx.identity.id)
  }
})
