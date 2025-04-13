import axios from 'axios'
// @ts-ignore
import jwt from 'jsonwebtoken'
import fs from 'fs'
import config from '../../config.js'
import logger from '../../utils/logging.js'
import Device from '../../models/device/index.js'

// Get OAuth 2.0 access token manually using JWT

let credentials = null, accessToken = null;

async function getCredentials() {
  if (credentials == null) {
    credentials = JSON.parse(fs.readFileSync(config.fcm.credentials, "utf-8"));
  }
  return credentials;
}

const getAccessToken = async () => {
  if (accessToken != null) return accessToken;

  // @ts-ignore
  const { client_email, private_key } = await getCredentials()

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  }

  const jwtToken = jwt.sign(payload, private_key, { algorithm: 'RS256' })

  const { data } = await axios.post(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtToken
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )

  return data.access_token
}

export const simplePush = async ({ tokens, notification, data = {}, options = {} }) => {
  if (!tokens.length) return

  const accessToken = await getAccessToken()
  const { project_id } = await getCredentials()
  const HEADERS = {
    Authorization: `Bearer ${accessToken}`
  }

  const failedTokens = []
  for (const token of tokens) {
    const body = {
      message: {
        token,
        notification: {
          title: 'Notification',
          body: notification
        },
        data,
        ...options
      }
    }

    try {
      const response = await axios.post(
        `https://fcm.googleapis.com/v1/projects/${project_id}/messages:send`,
        body,
        { headers: HEADERS }
      )
      logger.info(`Sent to ${token}: ${JSON.stringify(response.data)}`)
    } catch (err) {
      logger.error(`Error sending to ${token}:`, err.response?.data || err.message)
      failedTokens.push(token)
    }
  }

  await Device.cleanup(failedTokens)
}
