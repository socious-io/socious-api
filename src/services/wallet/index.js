import axios from 'axios'
import Shortner from '../../models/shortner/index.js'
import config from '../../config.js'
import { decodeJWT } from '../../utils/tools.js'
import { BadRequestError } from '../../utils/errors.js'

const headers = {
  apikey: config.wallet.agent_api_key
}

export const createDID = async () => {
  const didRes = await axios.post(
    `${config.wallet.agent}/cloud-agent/did-registrar/dids`,
    {
      documentTemplate: {
        publicKeys: [
          {
            id: 'auth-1',
            purpose: 'authentication'
          },
          {
            id: 'issue-1',
            purpose: 'assertionMethod'
          }
        ],
        services: []
      }
    },
    { headers }
  )

  const res = await axios.post(
    `${config.wallet.agent}/cloud-agent/did-registrar/dids/${didRes.data.longFormDid}/publications`,
    {},
    { headers }
  )

  return res.data.scheduledOperation.didRef
}

export const createConnectURL = async (callback) => {
  const res = await axios.post(
    `${config.wallet.agent}/cloud-agent/connections`,
    { label: 'Socious Claim Connection' },
    { headers }
  )
  const id = res.data.connectionId
  let url = res.data.invitation.invitationUrl
  url = url.replace('https://my.domain.com/path', config.wallet.connect_address)
  url += `&callback=${callback}/${id}`
  const shortner = await Shortner.create(url)
  return { url, id, short_id: shortner.short_id }
}

export const sendCredentials = async ({ connectionId, issuingDID, claims }) => {
  const payload = {
    claims,
    connectionId,
    issuingDID,
    schemaId: null,
    automaticIssuance: true
  }
  const res = await axios.post(`${config.wallet.agent}/cloud-agent/issue-credentials/credential-offers`, payload, {
    headers
  })
  return res.data
}

export const verifyProofRequest = async (connectionId) => {
  // @TODO: as prism has bug on check proofs write now we just make present without any proof
  // but we will check required schema and present
  const payload = {
    connectionId,
    proofs: [],
    options: {
      challenge: 'A challenge for the holder to sign',
      domain: 'socious.io'
    }
  }

  const res = await axios.post(`${config.wallet.agent}/cloud-agent/present-proof/presentations`, payload, { headers })
  return res.data
}

export const getPresentVerification = async (presentId) => {
  const date = new Date()
  const res = await axios.get(`${config.wallet.agent}/cloud-agent/present-proof/presentations/${presentId}`, {
    headers,
    params: { t: date.getTime() }
  })
  if (!res.data.status.toLowerCase().includes('verified')) throw new BadRequestError('not verified yet')
  const baseBody = decodeJWT(res.data.data[0])
  const { payload } = decodeJWT(baseBody.payload.vp.verifiableCredential[0])

  return payload.vc.credentialSubject
}
