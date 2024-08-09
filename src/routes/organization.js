import Router from '@koa/router'
import { validate } from '@socious/data'
import Org from '../models/organization/index.js'
import User from '../models/user/index.js'
import Referring from '../models/referring/index.js'
import { loginOptional, loginRequired } from '../utils/middlewares/authorization.js'
import { checkIdParams, orgMember } from '../utils/middlewares/route.js'
import { paginate } from '../utils/middlewares/requests.js'
import { BadRequestError, ValidationError } from '../utils/errors.js'
import config from '../config.js'
import { isTestEmail } from '../services/email/index.js'
import Notif from '../models/notification/index.js'
import Event from '../services/events/index.js'
import { recommendOrgByOrg, recommendUserByOrg } from '../services/recommender/index.js'

export const router = new Router()

const addShortname = async (request) => {
  if (request.body.shortname) return request.body.shortname

  let shortname = Org.generateShortname(request.body.name, request.body.website)
  while (await Org.shortNameExists(shortname)) {
    shortname = Org.generateShortname()
  }

  return shortname
}

router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = await Org.get(ctx.params.id, ctx.identity.id)
})

router.get('/by-shortname/:shortname', loginOptional, async (ctx) => {
  ctx.body = await Org.getByShortname(ctx.params.shortname, ctx.identity.id)
})

router.get('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Org.all({ ...ctx.paginate, currentIdentity: ctx.identity.id })
})

router.post('/', loginRequired, async (ctx) => {
  ctx.request.body.shortname = await addShortname(ctx.request)

  await validate.OrganizationSchema.validateAsync(ctx.request.body)
  if (!config.mail.allowTest && isTestEmail(ctx.request.body.email)) {
    throw new ValidationError('Invalid email')
  }

  const referredById = ctx.query.referred_by
  if (referredById) {
    const user = await User.get(referredById)

    if (!user.identity_verified) throw new BadRequestError('Referrer identity is not verified')
  }

  ctx.body = await Org.insert(ctx.user.id, ctx.request.body)
  if (ctx.query.auto_member !== 'false') await Org.addMember(ctx.body.id, ctx.user.id)
  if (referredById) await Referring.insert(ctx.body.id, referredById)

  if(ctx.searchTriggers) ctx.searchTriggers.indexOrganizations({ id: ctx.body.id })
})

router.get('/check', loginRequired, async (ctx) => {
  ctx.body = {
    shortname_exists: await Org.shortNameExists(ctx.query.shortname)
  }
})

router.post('/update/:id', loginRequired, checkIdParams, orgMember, async (ctx) => {
  ctx.request.body.shortname = await addShortname(ctx.request)

  await validate.OrganizationSchema.validateAsync(ctx.request.body)

  if (!config.mail.allowTest && isTestEmail(ctx.request.body.email)) {
    throw new ValidationError('Invalid email')
  }
  await Org.update(ctx.params.id, ctx.request.body)
  ctx.body = await Org.get(ctx.params.id)

  if(ctx.searchTriggers) ctx.searchTriggers.indexOrganizations({ id: ctx.body.id })
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
  const members = await Org.miniMembers(ctx.params.id)
  if (members.length < 2) throw new BadRequestError('last member not allow to be removed')
  await Org.removeMember(ctx.params.id, ctx.params.user_id)
  ctx.body = { message: 'success' }
})

router.post('/hiring', loginRequired, async (ctx) => {
  ctx.body = {
    hiring: await Org.hiring(ctx.identity.id)
  }
})

router.get('/:shortname/recommend/users', loginOptional, paginate, async (ctx) => {
  ctx.body = await recommendUserByOrg(ctx.params.shortname)
})

router.get('/:shortname/recommend/orgs', loginOptional, paginate, async (ctx) => {
  ctx.body = await recommendOrgByOrg(ctx.params.shortname)
})

router.get('/d/industries', loginOptional, paginate, async (ctx) => {
  ctx.body = await Org.industries({ ...ctx.paginate, q: ctx.query.q })
})
