import Router from '@koa/router'
import User from '../models/user/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { NotFoundError, PermissionError } from '../utils/errors.js'

export const router = new Router()

//Contributions
router.post('/optin', loginRequired, async (ctx) => {
  const {
    identity: { id, type }
  } = ctx
  if (type != 'users') throw new PermissionError()

  try {
    await User.optInContributions(id)
  } catch (e) {
    throw new NotFoundError()
  }
  ctx.body = {
    message: 'success'
  }
})

router.post('/leave', loginRequired, async (ctx) => {
  const {
    identity: { id, type }
  } = ctx
  if (type != 'users') throw new PermissionError()
  try {
    await User.leaveOutContributions(id)
  } catch (e) {
    throw new NotFoundError()
  }

  ctx.body = {
    message: 'success'
  }
})
