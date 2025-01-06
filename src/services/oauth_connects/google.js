// @ts-nocheck
import axios from 'axios'
import Config from '../../config.js'
import User from '../../models/user/index.js'
import Referring from '../../models/referring/index.js'
import { signin } from '../auth/jwt.js'
import { generateUsername } from '../auth/auth.js'
import { BadRequestError } from '../../utils/errors.js'

async function getGoogleUserInfo(accessToken) {
  const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.data // This contains user information
}

async function verifyGoogleToken(token) {
  const { data } = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
  const { aud, exp } = data

  // Validate the audience
  const currentTime = Math.floor(Date.now() / 1000)
  const clientId = Config.oauth.google.ios_id
  if (aud !== clientId || exp < currentTime) throw new BadRequestError('Token is invalid')

  return data
}

async function getGoogleToken(code, ref) {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: Config.oauth.google.id,
    client_secret: Config.oauth.google.secret,
    grant_type: 'authorization_code',
    redirect_uri: `${ref}oauth/google`
  })

  return await getGoogleUserInfo(response.data.access_token)
}

export async function googleLogin(platform, code, referredById, ref) {
  let userInfo

  if (platform == 'ios')
    userInfo = await verifyGoogleToken(code)
  else
    userInfo = await getGoogleToken(code, ref)

  try {
    const user = await User.getByEmail(userInfo.email)
    return {
      signin: signin(user.id),
      user
    }
  } catch {
    if (referredById) {
      const user = await User.get(referredById)

      if (!user.identity_verified) throw new BadRequestError('Referrer identity is not verified')
    }

    const username = generateUsername(userInfo.email)
    const user = await User.insert(userInfo.given_name, userInfo.family_name, username, userInfo.email)
    if (referredById) await Referring.insert(user.id, referredById)

    return {
      user,
      signin: signin(user.id),
      registered: true
    }
  }
}
