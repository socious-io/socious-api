import Router from '@koa/router'
import Identity from '../models/identity/index.js'
import Notif from '../models/notification/index.js'
import Referring from '../models/referring/index.js'
import Event from '../services/events/index.js'
import Credential from '../models/credentials/index.js'
import { getPresentVerification } from '../services/wallet/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { checkIdParams } from '../utils/middlewares/route.js'

export const router = new Router()

router.get('/', loginRequired, async (ctx) => {
  
  if (!ctx.user.identity_verified) {
    try {
      const vc = await Credential.getRequestVerificationByIdentity(ctx.identity.id)
      if (vc.present_id) {
        const credential = await getPresentVerification(vc.present_id)
        const rows = await Credential.searchSimilarVerification(credential)
        if (rows.length < 1) {
          await Credential.setVerificationApproved(vc.id, credential)
          const referred = await Referring.get(ctx.identity.id)
          if (referred) {
            Event.push(Event.Types.NOTIFICATION, referred.referred_by_id, {
              type: Notif.Types.REFERRAL_VERIFIED,
              refId: ctx.identity.id,
              parentId: ctx.identity.id,
              identity: ctx.identity
            })
          }
        }
      }
    } catch {}
  }
  ctx.body = await Identity.getAll(ctx.user.id, ctx.identity.id)
})

router.get('/:id', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Identity.get(ctx.params.id, ctx.identity.id)
})

router.get('/set/:id/session', loginRequired, checkIdParams, async (ctx) => {
  const identity = await Identity.get(ctx.params.id)
  await Identity.permissioned(identity, ctx.user.id)

  ctx.session.current_identity = identity.id

  ctx.body = { message: 'success' }
})
