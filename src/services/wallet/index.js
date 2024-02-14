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
  axiosResponseToCurl(res)
  return res.data
}


function axiosResponseToCurl(axiosResponse) {
  // Access the config from the response, which contains the request details
  const axiosConfig = axiosResponse.config;
  
  // Initialize the cURL command
  let curlCmd = `curl '${axiosConfig.url}'`;

  // Add method if not GET
  if (axiosConfig.method && axiosConfig.method.toUpperCase() !== 'GET') {
    curlCmd += ` -X ${axiosConfig.method.toUpperCase()}`;
  }

  // Add headers if any
  if (axiosConfig.headers) {
    Object.keys(axiosConfig.headers).forEach(function(header) {
      // Skip headers that are automatically added by the browser or Axios
      if (!['Host', 'Content-Length', 'Connection'].includes(header)) {
        curlCmd += ` -H '${header}: ${axiosConfig.headers[header]}'`;
      }
    });
  }

  // Add data if any (for POST, PUT requests)
  if (axiosConfig.data && (axiosConfig.method.toUpperCase() === 'POST' || axiosConfig.method.toUpperCase() === 'PUT')) {
    // If data is an object, stringify it
    const data = typeof axiosConfig.data === 'object' ? JSON.stringify(axiosConfig.data) : axiosConfig.data;
    curlCmd += ` --data-raw '${data}'`;
  }

  // Print the cURL command
  console.log(' ---------------------')
  console.log(curlCmd);
  console.log(' ---------------------')
}
