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

const partyName = 'PROOFSPACE'

export const Claim = async (body, headers) => {
  const signature = headers['x-body-signature']
  if (!signature) {
    throw new PermissionError('X-Body-Signature header is absent')
  }

  const publicKey = await fs.readFile(Config.services.proofspace.webhookKey)

  const buff = Buffer.from(JSON.stringify(body))
  const verified = crypto.verify(
    'sha3-256',
    buff,
    publicKey.toString(),
    Buffer.from(signature, 'base64')
  )
  if (!verified) throw new PermissionError('Invalid Body Signature')

  await Webhook.insert(partyName, body)

  const fields = body.receivedCredentials[0]?.fields
  let userId
  for (const f of fields) if (f.name === 'Socious User ID') userId = f.value

  if (!userId) throw new BadRequestError('Socious User ID not found')

  const user = await addUserConnectDid(userId)

  const records = await ImpactPoints.history(user.id, { offset: 0, limit: 100 })

  const issues = records.map((r) => {
    return {
      credentialId: Config.services.proofspace.credentialId,
      schemaId: Config.services.proofspace.schemaId.replace('"', ''),
      fields: [
        {
          name: 'Organisation',
          value: r.organization.name || r.organization.shortname
        },
        { name: 'Type of Mission', value: r.social_cause_category },
        {
          name: 'Start Date',
          value: `${Math.round(
            new Date(r.mission.created_at).getTime() / 1000
          )}`
        },
        {
          name: 'End Date',
          value: `${Math.round(r.created_at.getTime() / 1000)}`
        },
        { name: 'Impact Points Earned', value: `${r.total_points}` },
        { name: 'Cumulative Impact Points', value: `${user.impact_points}` }
      ],
      utcIssuedAt: r.created_at.getTime(),
      revoked: false
    }
  })

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

  const issue = [{
    credentialId: Config.services.proofspace.credentialId,
    schemaId: Config.services.proofspace.schemaId,
    fields: [
      {
        name: 'Organisation',
        value: r.organization.name || r.organization.shortname
      },
      { name: 'Type of Mission', value: r.social_cause_category },
      { name: 'Start Date', value: `${Math.round(
        new Date(r.mission.created_at).getTime() / 1000
      )}` },
      { name: 'End Date', value: `${Math.round(r.created_at.getTime() / 1000)}` },
      { name: 'Impact Points Earned', value: `${r.total_points}` },
      { name: 'Cumulative Impact Points', value: `${user.impact_points}` }
    ],
    utcIssuedAt: r.created_at.getTime(),
    revoked: false
  }]

  const body = {
    serviceDid: Config.services.proofspace.serviceId,
    subscriberConnectDid: user.proofspace_connect_id,
    subscriberEventId: '1',
    credentials: issue,
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

export default {
  Claim,
  Sync,
  SyncWorker
}
