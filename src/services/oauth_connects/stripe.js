import Config from '../../config.js'
import Stripe from 'stripe'
import Data from '@socious/data'
import { upsert, get, updateStatus } from './tokens.js'

export const PROVIDER = 'STRIPE'

export const stripe = Stripe(Config.payments.stripe.secret_key)

// TODO: should be on redis or any stable ramdbs
const accountsTmp = {}

export const connectLink = async (identityId, { country }) => {
  const account = await stripe.accounts.create({
    type: 'express',
    country,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    },
    settings: {
      payouts: {
        schedule: {
          interval: 'manual'
        }
      }
    }
  })

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${Config.payments.stripe.connect_redirect}?stripe_account=${account.id}`,
    return_url: `${Config.payments.stripe.connect_redirect}?stripe_account=${account.id}`,
    type: 'account_onboarding'
  })

  accountsTmp[account.id] = identityId

  return accountLink
}

export const authorize = async ({ stripe_account }) => {
  const account = await stripe.accounts.retrieve(stripe_account)

  const identityId = accountsTmp[account.id]

  const oauth = await upsert(identityId, {
    provider: PROVIDER,
    status: account.details_submitted ? Data.UserStatusType.ACTIVE : Data.UserStatusType.INACTIVE,
    mui: account.id,
    access_token: 'empty',
    refresh_token: 'empty',
    expire: null,
    meta: {}
  })

  delete accountsTmp[account.id]

  return {
    account_id: account.id,
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
    mui: oauth.matrix_unique_id,
    ...account,
    status
  }
}
