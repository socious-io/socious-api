import axios from 'axios'
import config from '../../config.js'

export const createDID = async () => {
  const didRes = await axios.post(`${config.wallet.agent}/prism-agent/did-registrar/dids`, {
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
  })

  const res = await axios.post(
    `${config.wallet.agent}/prism-agent/did-registrar/dids/${didRes.data.longFormDid}/publications`
  )

  return res.data.scheduledOperation.didRef
}

export const createConnectURL = async () => {
  const res = await axios.post(`${config.wallet.agent}/prism-agent/connections`, {"label": "Socious Claim Connection"})
  const id = res.data.connectionId
  let url = res.data.invitation.invitationUrl
  url = url.replace('https://my.domain.com/path', config.wallet.connect_address)
  url += `&callback=${config.wallet.callback}/${id}`
  return { url, id }
}

export const sendCredentials = async ({ connectionId, issuingDID, claims }) => {
  const res = await axios.post(`${config.wallet.agent}/prism-agent/issue-credentials/credential-offers`, {
    claims,
    connectionId,
    issuingDID,
    schemaId: null,
    automaticIssuance: true
  })
  return res.data
}
