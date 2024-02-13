import Router from '@koa/router'
import User from '../models/user/index.js'
import Org from '../models/organization/index.js'
import { BadRequestError, PermissionError } from '../utils/errors.js'
import { checkIdParams } from '../utils/middlewares/route.js'
import { paginate } from '../utils/middlewares/requests.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { createConnecURL, createDID, sendCredentials } from '../services/wallet/index.js'

export const router = new Router()

router.get('/experiences', loginRequired, paginate, async (ctx) => {
  ctx.body = await User.requestedExperienceCredentials(ctx.identity.id, ctx.paginate)
})

router.post('/experiences/:id', loginRequired, checkIdParams, async (ctx) => {
  const experience = await User.getExperience(ctx.params.id)
  if (experience.user_id !== ctx.user.id) throw new PermissionError()
  ctx.body = await User.requestExperienceCredentials(experience.id, ctx.user.id, experience.org_id)
})

router.post('/experiences/:id/approve', loginRequired, checkIdParams, async (ctx) => {
  const experience = await User.getRequestExperienceCredentials(ctx.params.id)
  if (experience.org_id !== ctx.identity.id) throw new PermissionError()
  const org = await Org.get(ctx.identity.id)

  if (!org.did) {
    const did = await createDID()
    await Org.updateDID(org.id, did)
  }

  ctx.body = await User.requestedExperienceCredentialsUpdate({ id: ctx.params.id, status: 'APPROVED' })
})

router.post('/experiences/:id/claim', loginRequired, checkIdParams, async (ctx) => {
  const experience = await User.getRequestExperienceCredentials(ctx.params.id)
  if (experience.user_id !== ctx.user.id) throw new PermissionError()
  const connect = await createConnecURL()

  await User.requestedExperienceCredentialsUpdate({
    id: ctx.params.id,
    status: experience.status,
    connection_id: connect.id,
    connection_url: connect.url
  })

  ctx.body = connect
})

router.post('/experiences/connect/callback/:id', async (ctx) => {
  if (ctx.query.reject) throw new BadRequestError()

  const e = await User.getRequestExperienceCredentialsbyConnection(ctx.params.id)

  if (e.status !== 'APPROVED') throw new PermissionError()

  const claims = {
    recipient_name: `${e.user.first_name} ${e.user.last_name}`,
    job_title: e.experience.title,
    job_category: e.experience.job_category_id,
    employment_type: e.experience.employment_type,
    company_name: e.org.name,
    start_date: e.experience.start_at,
    end_date: e.experience.end_at
  }

  await sendCredentials({
    connectionId: e.connection_id,
    issuingDID: e.org.did,
    claims
  })

  await User.requestedExperienceCredentialsUpdate({
    id: ctx.params.id,
    status: 'SENT',
    connection_id: e.connection_id,
    connection_url: e.connection_url
  })

  ctx.body = { message: 'success' }
})
