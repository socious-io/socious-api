import axios from 'axios'
import jwt from 'jsonwebtoken'
import config from './config'
import logger from './logger'

// Get OAuth 2.0 access token manually using JWT
const getAccessToken = async () => {
  const { client_email, private_key, project_id } = config.fcm.serviceAccount

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
  const { project_id } = config.fcm.serviceAccount
  const HEADERS = {
    Authorization: `Bearer ${accessToken}`
  }

  const failedTokens = []

  for (const token of tokens) {
    const body = {
      message: {
        token,
        notification,
        data,
        android: options.android,
        apns: options.apns,
        webpush: options.webpush
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
