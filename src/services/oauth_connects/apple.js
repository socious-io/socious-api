import axios from 'axios'
import Config from '../../config.js'
import Jwt from 'jsonwebtoken'
import fs from 'fs/promises'
import User from '../../models/user/index.js'
import Referring from '../../models/referring/index.js'
import { signin } from '../auth/jwt.js'
import { generateUsername } from '../auth/auth.js'
import { BadRequestError } from '../../utils/errors.js'

async function getAppleToken({code, clientId, privateKeyPath, keyid, teamId}) {
  // Create the client secret
  const privateKey = await fs.readFile(privateKeyPath)
  const client_secret = Jwt.sign(
    {
      iss: teamId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15777000, // 6 months
      aud: 'https://appleid.apple.com',
      sub: clientId
    },
    privateKey,
    { algorithm: 'ES256', keyid }
  )

  // Exchange the authorization code for tokens
  let token
  try {
    const response = await axios.post(
      'https://appleid.apple.com/auth/token',
      {
        client_id: clientId,
        client_secret,
        code,
        grant_type: 'authorization_code'
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    )

    token = response.data
  } catch (error) {
    console.error('Error getting Apple auth token:', error)
    throw error
  }

  return Jwt.decode(token.id_token)
}

export async function appleLogin(code, referredById, platform) {
  
  const userInfo = await getAppleToken({
    code,
    clientId: platform == 'ios' ? Config.oauth.apple.ios_client_id : Config.oauth.apple.client_id,
    privateKeyPath: Config.oauth.apple.privateKeyPath,
    keyid: Config.oauth.apple.key_id,
    teamId: Config.oauth.apple.team_id
  })

  const { email, name } = userInfo

  try {
    const user = await User.getByEmail(email)
    return {
      signin: signin(user.id),
      user
    }
  } catch {
    if (referredById) {
      const user = await User.get(referredById)

      if (!user.identity_verified) throw new BadRequestError('Referrer identity is not verified')
    }

    const username = generateUsername(email)
    const user = await User.insert(name?.first_name, name?.last_name, username, email)
    if (referredById) await Referring.insert(user.id, referredById)

    return {
      user,
      signin: signin(user.id),
      registered: true
    }
  }
}
