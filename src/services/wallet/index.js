import axios from 'axios'
import config from '../../config.js'
import { decodeJWT } from '../../utils/tools.js'
import { BadRequestError } from '../../utils/errors.js'

const headers = {
  apikey: config.wallet.agent_api_key
}

export const createDID = async () => {
  const didRes = await axios.post(
    `${config.wallet.agent}/prism-agent/did-registrar/dids`,
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
    `${config.wallet.agent}/prism-agent/did-registrar/dids/${didRes.data.longFormDid}/publications`
  )

  return res.data.scheduledOperation.didRef
}

export const createConnectURL = async (callback) => {
  const res = await axios.post(`${config.wallet.agent}/prism-agent/connections`, { label: 'Socious Claim Connection' })
  const id = res.data.connectionId
  let url = res.data.invitation.invitationUrl
  url = url.replace('https://my.domain.com/path', config.wallet.connect_address)
  url += `&callback=${callback}/${id}`
  return { url, id }
}

export const sendCredentials = async ({ connectionId, issuingDID, claims }) => {
  const payload = {
    claims,
    connectionId,
    issuingDID,
    schemaId: null,
    automaticIssuance: true
  }
  const res = await axios.post(`${config.wallet.agent}/prism-agent/issue-credentials/credential-offers`, payload, {
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

  const res = await axios.post(`${config.wallet.agent}/prism-agent/present-proof/presentations`, payload, { headers })
  return res.data
}

export const getPresentVerification = async (presentId) => {
  const date = new Date()
  const res = await axios.get(`${config.wallet.agent}/prism-agent/present-proof/presentations/${presentId}`, {
    headers,
    params: { t: date.getTime() }
  })
  if (!res.data.status.toLowerCase().includes('verified')) throw new BadRequestError('not verified yet')
  const baseBody = decodeJWT(res.data.data[0])
  const { payload } = decodeJWT(baseBody.payload.vp.verifiableCredential[0])

  return payload.vc.credentialSubject
}
