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
  const { identity, request: { body } } = ctx
  const { title } = body

  await validate.PreferencesSchema.validateAsync(body)

  try{
    const oldPreference = await Preferences.getOneByIdentityAndTitle(identity.id, title);
    if (oldPreference) ctx.body = await Preferences.updateById(oldPreference.id, body);
    return;
  }catch(e){
    logger.error('Preference not found, will create one')
  }

  ctx.body = await Preferences.create(identity.id, body)
  
})
