import Config from '../../config.js'
import Stripe from 'stripe'
import Data from '@socious/data'
import { upsert, get, updateStatus } from './tokens.js'

export const PROVIDER = 'STRIPE'

export const stripe = Stripe(Config.payments.stripe.secret_key)

// TODO: should be on redis or any stable ramdbs
const accountsTmp = {}

export const connectLink = async (identityId) => {
  const account = await stripe.accounts.create({
    type: 'express'
  })

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: Config.payments.stripe.connect_redirect,
    return_url: Config.payments.stripe.connect_redirect,
    type: 'account_onboarding'
  })

  accountsTmp[account.id] = identityId

  return accountLink
}

export const authorize = async ({ code }) => {
  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code
  })

  const account = await stripe.accounts.retrieve(response.stripe_user_id)

  const identityId = accountsTmp[account.id]

  const oauth = await upsert(identityId, {
    provider: PROVIDER,
    status: account.details_submitted ? Data.UserStatusType.ACTIVE : Data.UserStatusType.INACTIVE,
    mui: response.stripe_user_id,
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expire: null,
    meta: {}
  })

  delete accountsTmp[account.id]

  return {
    account_id: response.stripe_user_id,
    status: oauth.status
  }
}

export const refresh = async (identityId) => {
  const oauth = await get(identityId, PROVIDER)

  const account = await stripe.accounts.retrieve(oauth.matrix_unique_id)

  const response = await stripe.oauth.token({
    grant_type: 'refresh_token',
    refresh_token: oauth.refresh_token
  })

  await upsert(identityId, {
    provider: PROVIDER,
    mui: response.stripe_user_id,
    status: account.details_submitted ? Data.UserStatusType.ACTIVE : Data.UserStatusType.INACTIVE,
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expire: null,
    meta: {}
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
