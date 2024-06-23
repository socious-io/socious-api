import Shortner from '../models/shortner/index.js'
import Router from '@koa/router'
import { createConnectURL, sendCredentials } from '../services/wallet/index.js'
import config from '../config.js'
import { PermissionError } from '../utils/errors.js'

export const router = new Router()

router.get('/r/:id', async (ctx) => {
  const shorner = await Shortner.get(ctx.params.id)
  ctx.redirect(shorner.long_url)
})

router.get('/r/:id/fetch', async (ctx) => {
  ctx.body = await Shortner.get(ctx.params.id)
})

router.get('/verify/claims/:apikey/:id', async (ctx) => {
  if (ctx.params.apikey !== config.adminApiKey) throw new PermissionError()
  sendCredentials({
    connectionId: ctx.params.id,
    issuingDID: config.wallet.trust_did,
    claims: {
      type: 'verification',
      first_name: 'Ehsan',
      last_name: 'Mahmoudi',
      document_type: 'WhoIsYourDaddy',
      issued_date: new Date().toISOString()
    }
  })
  ctx.body = { message: 'success' }
})

router.get('/generate/fake/kyc', async (ctx) => {
  if (ctx.query.apikey !== config.adminApiKey) throw new PermissionError()
  ctx.body = await createConnectURL(`https://${ctx.request.host}/verify/claims/${config.adminApiKey}`)
})
