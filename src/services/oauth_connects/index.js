import {
  PROVIDER as STRIPE_PROVIDER,
  authorize as stripeAuth,
  refresh as stripeRefresh,
  profile as stripeProfile,
  connectLink as stripeConnectLink
} from './stripe.js'
import { get } from './tokens.js'
import { NotImplementedError } from '../../utils/errors.js'

const authorize = async (provider, body) => {
  switch (provider) {
    case STRIPE_PROVIDER:
      return stripeAuth(body)
    default:
      throw new NotImplementedError()
  }
}

const refresh = async (identityId, provider) => {
  switch (provider) {
    case STRIPE_PROVIDER:
      return stripeRefresh(identityId)
    default:
      throw new NotImplementedError()
  }
}

const profile = async (identityId, provider, options) => {
  switch (provider) {
    case STRIPE_PROVIDER:
      return stripeProfile(identityId, options)
    default:
      throw new NotImplementedError()
  }
}

const link = async (identityId, provider, meta) => {
  switch (provider) {
    case STRIPE_PROVIDER:
      return stripeConnectLink(identityId, meta)
    default:
      throw new NotImplementedError()
  }
}

export default {
  get,
  authorize,
  refresh,
  profile,
  link
}
