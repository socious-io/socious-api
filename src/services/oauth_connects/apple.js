import axios from 'axios'
import Config from '../../config.js'
import Jwt from 'jsonwebtoken'
import fs from 'fs/promises'
import User from '../../models/user/index.js'
import Referring from '../../models/referring/index.js'
import { signin } from '../auth/jwt.js'
import { generateUsername } from '../auth/auth.js'
import { BadRequestError } from '../../utils/errors.js'

async function getAppleUserInfo(accessToken) {
  const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.data // This contains user information
}

export async function appleLogin(code, first_name, last_name, referredById, ref) {

  // Create the client secret
  console.log(Config.oauth.apple.privateKeyPath)
  const privateKey = await fs.readFile(Config.oauth.apple.privateKeyPath)
  const client_secret = Jwt.sign({
    iss: Config.oauth.apple.team_id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 15777000, // 6 months
    aud: 'https://appleid.apple.com',
    sub: Config.oauth.apple.client_id
  }, privateKey, { algorithm: 'ES256', keyid: Config.oauth.apple.key_id });


  // Exchange the authorization code for tokens
  let token;
  try {
    const response = await axios.post('https://appleid.apple.com/auth/token', {
      client_id: Config.oauth.apple.client_id,
      client_secret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: ref,
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    token = response.data;
  } catch (error) {
    console.error('Error getting Apple auth token:', error);
    throw error;
  }

  // Verify and decode the ID token to get user information
  const {email} = Jwt.decode(token.id_token);

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
    const user = await User.insert(first_name, last_name, username, email)
    if (referredById) await Referring.insert(user.id, referredById)

    return {
      user,
      signin: signin(user.id),
      registered: true
    }
  }
}
