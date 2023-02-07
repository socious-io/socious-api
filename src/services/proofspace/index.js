import axios from 'axios'
import fs from 'fs/promises'
import crypto from 'crypto'
import Config from '../../config.js'
import Webhook from '../../models/webhooks/index.js'
import User from '../../models/user/index.js'
import sql from 'sql-template-tag'
import { app } from '../../index.js'
import ImpactPoints from '../impact_points/index.js'
import { BadRequestError, PermissionError } from '../../utils/errors.js'
import publish from '../jobs/publish.js'
import Sign from '../../utils/signature.js'
import logger from '../../utils/logging.js'
import Data from '@socious/data'

const partyName = 'PROOFSPACE'

export const Claim = async (body, headers) => {
  const signature = headers['x-body-signature']
  if (!signature) {
    throw new PermissionError('X-Body-Signature header is absent')
  }
  const publicKey = await fs.readFile(Config.services.proofspace.webhookKey)

  const buff = Buffer.from(JSON.stringify(body))
  const verified = crypto.verify('sha3-256', buff, publicKey.toString(), Buffer.from(signature, 'base64'))
  if (!verified) throw new PermissionError('Invalid Body Signature')

  await Webhook.insert(partyName, body)

  const fields = body.receivedCredentials[0]?.fields
  let userId
  for (const f of fields) if (f.name === 'Socious User ID') userId = f.value

  if (!userId) throw new BadRequestError('Socious User ID not found')

  const user = await addUserConnectDid(userId)

  if (!user) throw new BadRequestError('Socious User ID not found')

  const records = await ImpactPoints.history(user.id, { offset: 0, limit: 100 })

  const issues = records.map((r) => makeIssue(r, user))

  const response = {
    serviceDid: body.serviceDid,
    subscriberConnectDid: body.subscriberConnectDid,
    actionEventId: body.actionEventId,
    issuedCredentials: issues,
    revokedCredentials: [] // can be kept as an empty array
  }

  console.log(JSON.stringify(response))

  return response
}

export const Sync = async ({ impact_points_id }) => {
  publish('sync_proofspace', { impact_points_id })
}

export const SyncWorker = async ({ impact_points_id }) => {
  let r
  try {
    r = await ImpactPoints.get(impact_points_id)
  } catch (err) {
    logger.error(`sync proofspace fetching point : ${err.message}`)
    return
  }

  let user

  try {
    user = await User.get(r.identity_id)
  } catch (err) {
    logger.error(`sync proofspace fetching user ${r.identity_id} : ${err.message}`)
    return
  }

  const body = {
    serviceDid: Config.services.proofspace.serviceId,
    subscriberConnectDid: user.proofspace_connect_id,
    subscriberEventId: '1',
    credentials: [makeIssue(r, user)],
    revokedCredentials: [],
    issuedAt: new Date().getTime(),
    ok: true
  }

  const privateKey = await fs.readFile(Config.privateKey)
  const sign = new Sign(privateKey.toString(), '')
  const binaryBody = sign.binaryJson(body)
  const headers = {
    'x-body-signature': sign.sign(binaryBody)
  }

  const URL = `https://platform.proofspace.id/service/${Config.services.proofspace.serviceId}/webhook-accept/credentials-issued`

  try {
    const response = await axios.post(URL, binaryBody, { headers })
    logger.info(JSON.stringify(body))
    logger.info(response.data)
  } catch (err) {
    logger.error(err)
  }
}

const addUserConnectDid = async (userId, connectId) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE users SET 
        proofspace_connect_id=${connectId} 
      WHERE id=${userId}
      RETURNING id, impact_points
    `)
    return rows[0]
  } catch {
    throw new BadRequestError(`User ${userId} not found`)
  }
}
/**
 * @param {import('../../../types/associations').IImpactPointHistoryAsso} impactPoint
 * @param {import('../../../types/types').IUsersEntity} user
 */
const makeIssue = (impactPoint, user) => {
  let jobType = 0
  switch (impactPoint.project?.project_type) {
    case Data.ProjectType.PART_TIME:
      jobType = 1
      break
    case Data.ProjectType.FULL_TIME:
      jobType = 2
      break
    default:
      jobType = 0
  }

  return {
    credentialId: Config.services.proofspace.credentialId,
    schemaId: Config.services.proofspace.schemaId,
    fields: [
      {
        name: 'Organization',
        value: impactPoint.organization.name || impactPoint.organization.shortname
      },
      { name: 'Type of Mission', value: impactPoint.social_cause_category },
      {
        name: 'Start Date',
        value: `${Math.round(new Date(impactPoint.mission.created_at).getTime() / 1000)}`
      },
      {
        name: 'End Date',
        value: `${Math.round(impactPoint.created_at.getTime() / 1000)}`
      },
      { name: 'Impact Points Earned', value: `${impactPoint.total_points}` },
      { name: 'Cumulative Impact Points', value: `${user.impact_points}` },
      { name: 'Job Title', value: `${impactPoint.project?.title}` },
      { name: 'Job Description', value: `${impactPoint.project?.description}` },
      { name: 'Job Category', value: `${impactPoint.job_category.name}` },
      { name: 'Skills', value: `${impactPoint.project.skills.join(',')}` },
      { name: 'Job Type', value: `${jobType}` },
      { name: 'Total Hours', value: `${impactPoint.offer.total_hours}` },
      { name: 'Country', value: `${impactPoint.project.country}` },
      { name: 'City', value: `${impactPoint.project.city}` },
      {
        name: 'Remote Preference',
        value: `${impactPoint.project?.remote_preference}`
      },
      {
        name: 'Payment Type',
        value: `${impactPoint.project?.payment_type === Data.ProjectPaymentType.PAID ? 0 : 1}`
      },
      {
        name: 'Payment Scheme',
        value: `${impactPoint.project?.payment_scheme === Data.ProjectPaymentSchemeType.FIXED ? 0 : 1}`
      },
      {
        name: 'Payment Mode',
        value: '2'
      },
      {
        name: 'Payment currency',
        value: `${impactPoint.project?.payment_currency}`
      },
      {
        name: 'Total Payment Received',
        value: `${impactPoint.offer?.assignment_total}`
      },
      {
        name: 'Experience Level',
        value: `${impactPoint.project?.experience_level}`
      },
      {
        name: 'Review by the Organization',
        value: `1`
      }
    ],
    utcIssuedAt: impactPoint.created_at.getTime(),
    revoked: false
  }
}

export default {
  Claim,
  Sync,
  SyncWorker
}
