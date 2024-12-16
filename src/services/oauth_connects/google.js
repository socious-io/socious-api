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

export async function googleLogin(platform, code, referredById, ref) {
  let userInfo;

  if (platform && platform == 'ios') {
    const { data } = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${code}`)

    // Validate the audience
    if (data.aud !== Config.oauth.google_ios.id || data.exp < Math.floor(Date.now() / 1000)) {
      throw new BadRequestError('Token is invalid')
    }
    userInfo = data
    
  } else {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: Config.oauth.google.id,
      client_secret: Config.oauth.google.secret,
      grant_type: 'authorization_code',
      redirect_uri: `${ref}oauth/google`
    })
    userInfo = await getGoogleUserInfo(response.data.access_token)
  }

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
