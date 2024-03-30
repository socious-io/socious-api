import Router from '@koa/router'
import Config from '../config.js'
import { koaSwagger } from 'koa2-swagger-ui'
import yamljs from 'yamljs'
import blocker from '../utils/middlewares/blocker.js'

import { router as ping } from './ping.js'
import { router as auth } from './auth.js'
import { router as user } from './user.js'
import { router as org } from './organization.js'
import { router as identity } from './identity.js'
import { router as post } from './post.js'
import { router as follow } from './follow.js'
import { router as notif } from './notification.js'
import { router as project } from './project.js'
import { router as applicant } from './applicant.js'
import { router as chat } from './chat.js'
import { router as device } from './device.js'
import { router as media } from './media.js'
import { router as skill } from './skill.js'
import { router as search } from './search.js'
import { router as webhook } from './webhook.js'
import { router as payment } from './payment.js'
import { router as mission } from './mission.js'
import { router as offer } from './offer.js'
import { router as site } from './site.js'
import { router as testEmails } from './test-emails.js'
import { router as connect } from './connect.js'
import { router as geo } from './geo.js'
import { router as additionals } from './additionals.js'
import { router as credentials } from './credentials.js'
import { router as referring } from './referring.js'

export default (app) => {
  const blueprint = new Router()

  const spec = yamljs.load('./docs/openapi.yml')

  blueprint.use('/site', site.routes(), site.allowedMethods())

  blueprint.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }))

  blueprint.use('/webhooks', webhook.routes(), webhook.allowedMethods())

  blueprint.use('/ping', ping.routes(), ping.allowedMethods())
  blueprint.use('/auth', blocker(Config.requestBlocker.auth), auth.routes(), auth.allowedMethods())
  blueprint.use('/user', user.routes(), user.allowedMethods())
  blueprint.use('/identities', identity.routes(), identity.allowedMethods())
  blueprint.use('/orgs', org.routes(), org.allowedMethods())
  blueprint.use('/posts', post.routes(), post.allowedMethods())
  blueprint.use('/projects', project.routes(), project.allowedMethods())
  blueprint.use('/applicants', applicant.routes(), applicant.allowedMethods())
  blueprint.use('/follows', follow.routes(), follow.allowedMethods())
  blueprint.use('/notifications', notif.routes(), notif.allowedMethods())

  blueprint.use('/chats', chat.routes(), chat.allowedMethods())
  blueprint.use('/devices', device.routes(), device.allowedMethods())

  blueprint.use('/media', media.routes(), media.allowedMethods())
  blueprint.use('/skills', skill.routes(), skill.allowedMethods())
  blueprint.use('/search', search.routes(), search.allowedMethods())
  blueprint.use('/payments', payment.routes(), payment.allowedMethods())
  blueprint.use('/missions', mission.routes(), mission.allowedMethods())
  blueprint.use('/offers', offer.routes(), offer.allowedMethods())
  blueprint.use('/connections', connect.routes(), connect.allowedMethods())
  blueprint.use('/geo', geo.routes(), geo.allowedMethods())
  blueprint.use('/additionals', additionals.routes(), additionals.allowedMethods())
  blueprint.use('/credentials', credentials.routes(), credentials.allowedMethods())
  blueprint.use('/referrers', referring.routes(), referring.allowedMethods())

  if (Config.mail.allowTest) {
    blueprint.use('/test-emails', testEmails.routes(), testEmails.allowedMethods())
  }

  app.use(blueprint.routes(), blueprint.allowedMethods())
}
