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

export async function googleLogin(code, referredById, ref) {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: Config.oauth.google.id,
    client_secret: Config.oauth.google.secret,
    grant_type: 'authorization_code',
    redirect_uri: `${ref}oauth/google`
  })

  const userInfo = await getGoogleUserInfo(response.data.access_token)

  try {
    const user = await User.getByEmail(userInfo.email)
    return signin(user.id)
  } catch {
    if (referredById) {
      const user = await User.get(referredById)

      if (!user.identity_verified) throw new BadRequestError('Referrer identity is not verified')
    }

    const username = generateUsername(userInfo.email)
    const user = await User.insert(userInfo.given_name, userInfo.family_name, username, userInfo.email)
    if (referredById) await Referring.insert(user.id, referredById)

    return {
      ...signin(user.id),
      registered: true
    }
  }
}
