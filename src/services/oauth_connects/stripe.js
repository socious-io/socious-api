import Config from '../../config.js'
import Stripe from 'stripe'
import Data from '@socious/data'
import { upsert, get, updateStatus } from './tokens.js'

export const PROVIDER = 'STRIPE'

export const stripe = Stripe(Config.payments.stripe.secret_key)

export const authorize = async (identityId, { code }) => {
  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code
  })

  const account = await stripe.accounts.retrieve(response.stripe_user_id)

  const oauth = await upsert(identityId, {
    provider: PROVIDER,
    status: account.details_submitted ? Data.UserStatusType.ACTIVE : Data.UserStatusType.INACTIVE,
    mui: response.stripe_user_id,
    access_token: response.access_token,
    refresh_token: response.refresh_token
  })

  return {
    account_id: response.stripe_user_id,
    status: oauth.status
  }
}

export const refresh = async (identityId) => {
  const oauth = await get(identityId, PROVIDER)

  const response = await stripe.oauth.token({
    grant_type: 'refresh_token',
    refresh_token: oauth.refresh_token
  })

  await upsert(identityId, {
    provider: PROVIDER,
    mui: response.stripe_user_id,
    access_token: response.access_token,
    refresh_token: response.refresh_token
  })

  return response.access_token
}

export const profile = async (identityId) => {
  const oauth = await get(identityId, PROVIDER)
  const account = await stripe.accounts.retrieve(oauth.matrix_unique_id)
  const status = account.details_submitted ? Data.UserStatusType.ACTIVE : Data.UserStatusType.INACTIVE

  if (oauth.status !== status) await updateStatus(oauth.id, status)

  return {
    ...account,
    status
  }
}
