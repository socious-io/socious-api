//General
import Router from '@koa/router'
//Middlewares
import { loginRequired } from '../utils/middlewares/authorization.js'
// import { paginate } from '../utils/middlewares/requests.js'
//Models
import Preferences from '../models/preference/index.js'
import logger from '../utils/logging.js'
import { validate } from '@socious/data'

export const router = new Router()

router.get('/', loginRequired, async (ctx) => {
  const { identity } = ctx

  ctx.body = await Preferences.getAllByIdentity(identity.id)
})

router.post('/', loginRequired, async (ctx) => {
  const {
    identity,
    request: { body }
  } = ctx

  const validPreferences = []
  for(const preference of body.preferences) {
    try{
      await validate.PreferencesSchema.validateAsync(preference)
      validPreferences.push(preference)
    }catch{
      logger.error('Invalid preference, ignoring the current one')
    }
  }

  ctx.body = await Preferences.upsert(identity.id, validPreferences);
    
})


//TODO: add competitive-salary
