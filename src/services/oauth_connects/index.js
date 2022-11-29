import { PROVIDER as STRIPE_PROVIDER, authorize as stripeAuth, refresh as stripeRefresh } from './stripe.js';
import {get} from './tokens.js';
import { NotImplementedError } from '../../utils/errors.js'


const authorize = async (identityId, provider, body) => {
  switch (provider) {
    case STRIPE_PROVIDER:
      return stripeAuth(identityId, provider,body)
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

export default {
  get,
  authorize,
  refresh
}
