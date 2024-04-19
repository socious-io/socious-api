import Router from '@koa/router'
import User from '../models/user/index.js'
import Credential from '../models/credentials/index.js'
import Notif from '../models/notification/index.js'
import Event from '../services/events/index.js'
import Org from '../models/organization/index.js'
import { BadRequestError, PermissionError } from '../utils/errors.js'
import { checkIdParams } from '../utils/middlewares/route.js'
import { paginate } from '../utils/middlewares/requests.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import {
  createConnectURL,
  createDID,
  sendCredentials,
  verifyProofRequest,
  getPresentVerification
} from '../services/wallet/index.js'
import config from '../config.js'
import logger from '../utils/logging.js'

export const router = new Router()

router.post('/verifications', loginRequired, async (ctx) => {
  const connect = await createConnectURL(config.wallet.verification_callback)
  ctx.body = await Credential.requestVerification(ctx.identity.id, connect.id, connect.url)
})

router.get('/verifications/connect/callback/:id', async (ctx) => {
  const vc = await Credential.getRequestVerificationByConnection(ctx.params.id)
  const pp = await verifyProofRequest(vc.connection_id)
  await Credential.setPresent(vc.id, pp.presentationId)
  ctx.body = { message: 'success' }
})

router.get('/verifications', loginRequired, checkIdParams, async (ctx) => {
  const vc = await Credential.getRequestVerificationByIdentity(ctx.identity.id)
  if (!vc.present_id && vc.identity_id !== ctx.identity.id) throw new PermissionError()
  if (vc.status === 'APPROVED') {
    ctx.body = { message: 'success', verified: true }
    return
  }
  const credential = await getPresentVerification(vc.present_id)
  /* const rows = await Credential.searchSimilarVerification(credential)
  if (rows.length > 0) {
    ctx.body = { message: 'failed', verified: false }
    return
  } */
  await Credential.setVerificationApproved(vc.id, credential)
  ctx.body = { message: 'success', verified: true }
})
// -------------------------- Experience -------------------------------
router.get('/experiences', loginRequired, paginate, async (ctx) => {
  ctx.body = await Credential.requestedExperiences(ctx.identity.id, ctx.paginate)
})

router.post('/experiences/:id', loginRequired, checkIdParams, async (ctx) => {
  const experience = await User.getExperience(ctx.params.id)
  ctx.body = await Credential.requestExperience(
    experience.id,
    ctx.user.id,
    experience.org_id,
    ctx.request.body?.message,
    ctx.request.body?.exact_info
  )

  Event.push(Event.Types.NOTIFICATION, experience.org_id, {
    type: Notif.Types.EXPERIENCE_VERIFY_REQUEST,
    refId: experience.id,
    parentId: ctx.body.id,
    identity: ctx.identity
  })
})

router.post('/experiences/:id/approve', loginRequired, checkIdParams, async (ctx) => {
  const experience = await Credential.getRequestExperience(ctx.params.id)
  if (experience.org_id !== ctx.identity.id || experience.status !== 'PENDING') throw new PermissionError()

  const org = await Org.get(ctx.identity.id)

  if (!org.did) {
    const did = await createDID()
    await Org.updateDID(org.id, did)
  }

  ctx.body = await Credential.requestedExperienceUpdate({ id: ctx.params.id, status: 'APPROVED' })

  Event.push(Event.Types.NOTIFICATION, experience.user_id, {
    type: Notif.Types.EXPERIENCE_VERIFY_APPROVED,
    refId: experience.id,
    parentId: ctx.body.id,
    identity: ctx.identity
  })
})

router.post('/experiences/:id/reject', loginRequired, checkIdParams, async (ctx) => {
  const experience = await Credential.getRequestExperience(ctx.params.id)
  if (experience.org_id !== ctx.identity.id || experience.status !== 'PENDING') throw new PermissionError()

  ctx.body = await Credential.requestedExperienceUpdate({ id: ctx.params.id, status: 'REJECTED' })

  Event.push(Event.Types.NOTIFICATION, experience.user_id, {
    type: Notif.Types.EXPERIENCE_VERIFY_REJECTED,
    refId: experience.id,
    parentId: ctx.body.id,
    identity: ctx.identity
  })
})

router.post('/experiences/:id/claim', loginRequired, checkIdParams, async (ctx) => {
  const experience = await Credential.getRequestExperience(ctx.params.id)
  if (experience.user_id !== ctx.user.id) throw new PermissionError()
  const connect = await createConnectURL(config.wallet.experience_vc_callback)

  await Credential.requestedExperienceUpdate({
    id: ctx.params.id,
    status: experience.status,
    connection_id: connect.id,
    connection_url: connect.url
  })

  ctx.body = connect
})

router.get('/experiences/connect/callback/:id', async (ctx) => {
  if (ctx.query.reject) throw new BadRequestError()

  const e = await Credential.getRequestExperiencebyConnection(ctx.params.id)

  if (e.status !== 'APPROVED') throw new PermissionError()

  const claims = {
    recipient_name: `${e.user.first_name} ${e.user.last_name}`,
    job_title: e.experience.title,
    job_category: e.job_category.name,
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

  await Credential.requestedExperienceUpdate({
    id: e.id,
    status: 'SENT',
    connection_id: e.connection_id,
    connection_url: e.connection_url
  })

  ctx.body = { message: 'success' }
})

router.get('/experiences/connect/callback/:id', async (ctx) => {
  if (ctx.query.reject) throw new BadRequestError()

  const e = await Credential.getRequestExperiencebyConnection(ctx.params.id)

  if (e.status !== 'APPROVED') throw new PermissionError()

  const claims = {
    recipient_name: `${e.user.first_name} ${e.user.last_name}`,
    job_title: e.experience.title,
    job_category: e.job_category.name,
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

  await Credential.requestedExperienceUpdate({
    id: e.id,
    status: 'SENT',
    connection_id: e.connection_id,
    connection_url: e.connection_url
  })

  ctx.body = { message: 'success' }
})

// -------------------------- Education -------------------------------
router.get('/educations', loginRequired, paginate, async (ctx) => {
  ctx.body = await Credential.requestedEducations(ctx.identity.id, ctx.paginate)
})

router.post('/educations/:id', loginRequired, checkIdParams, async (ctx) => {
  const education = await User.getEducation(ctx.params.id)
  ctx.body = await Credential.requestEducation(
    education.id,
    ctx.user.id,
    education.org_id,
    ctx.request.body?.message,
    ctx.request.body?.exact_info
  )

  /* Event.push(Event.Types.NOTIFICATION, education.org_id, {
    type: Notif.Types.EXPERIENCE_VERIFY_REQUEST,
    refId: education.id,
    parentId: ctx.body.id,
    identity: ctx.identity
  }) */
})

router.post('/educations/:id/approve', loginRequired, checkIdParams, async (ctx) => {
  const education = await Credential.getRequestEducation(ctx.params.id)
  if (education.org_id !== ctx.identity.id || education.status !== 'PENDING') throw new PermissionError()

  const org = await Org.get(ctx.identity.id)

  if (!org.did) {
    const did = await createDID()
    await Org.updateDID(org.id, did)
  }

  ctx.body = await Credential.requestedEducationUpdate({ id: ctx.params.id, status: 'APPROVED' })

  /* Event.push(Event.Types.NOTIFICATION, education.user_id, {
    type: Notif.Types.EXPERIENCE_VERIFY_APPROVED,
    refId: education.id,
    parentId: ctx.body.id,
    identity: ctx.identity
  }) */
})

router.post('/educations/:id/reject', loginRequired, checkIdParams, async (ctx) => {
  const education = await Credential.getRequestEducation(ctx.params.id)
  if (education.org_id !== ctx.identity.id || education.status !== 'PENDING') throw new PermissionError()

  ctx.body = await Credential.requestedEducationUpdate({ id: ctx.params.id, status: 'REJECTED' })

  /* Event.push(Event.Types.NOTIFICATION, education.user_id, {
    type: Notif.Types.EXPERIENCE_VERIFY_REJECTED,
    refId: education.id,
    parentId: ctx.body.id,
    identity: ctx.identity
  }) */
})

router.post('/educations/:id/claim', loginRequired, checkIdParams, async (ctx) => {
  const education = await Credential.getRequestEducation(ctx.params.id)
  if (education.user_id !== ctx.user.id) throw new PermissionError()
  const connect = await createConnectURL(config.wallet.experience_vc_callback)

  await Credential.requestedEducationUpdate({
    id: ctx.params.id,
    status: education.status,
    connection_id: connect.id,
    connection_url: connect.url
  })

  ctx.body = connect
})

router.get('/educations/connect/callback/:id', async (ctx) => {
  if (ctx.query.reject) throw new BadRequestError()

  const e = await Credential.getRequestEducationbyConnection(ctx.params.id)

  if (e.status !== 'APPROVED') throw new PermissionError()

  const claims = {
    recipient_name: `${e.user.first_name} ${e.user.last_name}`,
    job_title: e.experience.title,
    job_category: e.job_category.name,
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

  await Credential.requestedEducationUpdate({
    id: e.id,
    status: 'SENT',
    connection_id: e.connection_id,
    connection_url: e.connection_url
  })

  ctx.body = { message: 'success' }
})

router.get('/educations/connect/callback/:id', async (ctx) => {
  if (ctx.query.reject) throw new BadRequestError()

  const e = await Credential.getRequestEducationbyConnection(ctx.params.id)

  if (e.status !== 'APPROVED') throw new PermissionError()

  const claims = {
    recipient_name: `${e.user.first_name} ${e.user.last_name}`,
    title: e.education.title,
    institute_name: e.org.name,
    degree: e.education.degree,
    grade: e.education.grade,
    start_date: e.experience.start_at,
    end_date: e.experience.end_at
  }

  await sendCredentials({
    connectionId: e.connection_id,
    issuingDID: e.org.did,
    claims
  })

  await Credential.requestedEducationUpdate({
    id: e.id,
    status: 'SENT',
    connection_id: e.connection_id,
    connection_url: e.connection_url
  })

  ctx.body = { message: 'success' }
})
