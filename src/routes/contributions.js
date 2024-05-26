import Router from '@koa/router'
import Contribution from '../models/contribution/index.js'
import { loginRequired } from '../utils/middlewares/authorization.js'
import { NotFoundError } from '../utils/errors.js'

export const router = new Router()

//Contributions
router.get('/', loginRequired, async (ctx) => {
  const {
    identity: { id }
  } = ctx

  try {
    ctx.body = await Contribution.getContributionStatus(id)
  } catch (e) {
    throw new NotFoundError()
  }
})

router.post('/optin', loginRequired, async (ctx) => {
  const {
    identity: { id }
  } = ctx

  ctx.body = await Contribution.optInContributions(id)
})

router.post('/leave', loginRequired, async (ctx) => {
  const {
    identity: { id }
  } = ctx
  try {
    await Contribution.leaveOutContributions(id)
  } catch (e) {
    throw new NotFoundError()
  }

  ctx.body = {
    message: 'success'
  }
})

//Contribution Invitations
router.get('/invitations', loginRequired, async (ctx) => {
  const {
    identity: { id },
    query: { invitation_type }
  } = ctx

  try {
    ctx.body = await Contribution.getAllContributionInvitationsByType(id, invitation_type)
  } catch (e) {
    console.log(e)
  }
})

router.get('/invitations/:invitation_id', loginRequired, async (ctx) => {
  const {
    identity: { id },
    params: { invitation_id }
  } = ctx

  ctx.body = await Contribution.getContributionInvitationById(id, invitation_id)
})

router.post('/invitations/:invitation_id/accept', loginRequired, async (ctx) => {
  const {
    identity: { id },
    params: { invitation_id }
  } = ctx

  ctx.body = await Contribution.updateContributionInvitationStatus(id, invitation_id, 'ACCEPTED')
})

router.post('/invitations/:invitation_id/decline', loginRequired, async (ctx) => {
  const {
    identity: { id },
    params: { invitation_id }
  } = ctx

  ctx.body = await Contribution.updateContributionInvitationStatus(id, invitation_id, 'DECLINED')
})
