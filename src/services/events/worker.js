import Data from '@socious/data'
import Config from '../../config.js'
import publish from '../jobs/publish.js'
import User from '../../models/user/index.js'
import Device from '../../models/device/index.js'
import Notif from '../../models/notification/index.js'
import Identity from '../../models/identity/index.js'
import Org from '../../models/organization/index.js'
import { makeMessage } from './message.js'
import axios from 'axios'
import logger from '../../utils/logging.js'

export const Types = {
  CHAT: 'chat',
  NOTIFICATION: 'notification'
}

const emitEvent = async (eventType, userId, id) => {
  try {
    const res = await axios.post(
      `${Config.webhooks.addr}/notify`,
      { eventType, id, user_id: userId },
      { headers: { token: Config.webhooks.token } }
    )
    return res.data.sent
  } catch {
    return false
  }
}

const pushNotifications = async (userIds, message, data) => {
  const devices = await Device.any(userIds)
  publish('fcm', {
    tokens: devices.map((d) => d.token),
    notification: message,
    data
  })
}

const email = async (notifType, userId, message, id, identityName, additionalKwargs = {}) => {
  let user = {}
  try {
    user = await User.get(userId)
  } catch (err) {
    logger.error(`[notify] => ${JSON.stringify(err)}`)
  }

  // if (!user.email_verified_at) return;

  publish('tmp_email', {
    to: user.email,
    subject: message.title,
    template: Config.mail.templates.notifications[notifType] || Config.mail.templates.notifications.GENERAL_NOTIF,
    kwargs: {
      notify_name: user.first_name,
      name: identityName,
      link: `${Config.notifAppLink}/${id}`,
      ...additionalKwargs
    }
  })
}

const getSetting = async (userId, type) => {
  let setting = (await Notif.settings(userId))?.filter((s) => s.type === type)[0]
  if (!setting) {
    setting = {
      in_app: true,
      email: true,
      push: true
    }
  }
  return setting
}

const send = async (userId, message, body, id, identityName, setting) => {
  if (setting.in_app) await emitEvent(Types.NOTIFICATION, userId, id)

  if (setting.push) await pushNotifications([userId], message, body)

  if (setting.email) {
    try {
      await email(body.type, userId, message, id, identityName, body.additionalKwargs)
    } catch (err) {
      logger.error(`sending email on notifications: ${err}`)
    }
  }
}

const coordinateNotifs = async (userId, body) => {
  const consolidateExceptions = [Data.NotificationType.APPLICATION, Data.NotificationType.FOLLOWED]
  const name = body.identity?.meta?.name || body.identity?.meta?.email
  let message = makeMessage(body.type, {
    name,
    org_name: body.org_name,
    job_name: body.job_name,
    dispute: body.dispute
  })
  const consolidateTime = 30 * 60 * 1000
  const now = new Date()
  const latest = await Notif.latest(userId, body.type, body.refId, new Date(now.getTime() - consolidateTime))

  const setting = await getSetting(userId, body.type)

  if (latest && !consolidateExceptions.includes(body.type)) {
    let consolidateNumbs = latest.data.consolidate_number + 1
    if (consolidateNumbs < 2) consolidateNumbs = 2

    message = makeMessage(body.type, `${consolidateNumbs} people`)

    await Notif.update(latest.id, userId, body.refId, body.type, !setting.in_app, {
      ...body,
      body: message,
      consolidate_number: consolidateNumbs
    })

    return send(userId, message, body, latest.id, name, setting)
  }

  const notifId = await Notif.create(userId, body.refId, body.type, !setting.in_app, {
    ...body,
    body: message,
    consolidate_number: 0
  })

  return send(userId, message, body, notifId, name, setting)
}

const _push = async (eventType, userId, body) => {
  switch (eventType) {
    case Types.NOTIFICATION:
      await coordinateNotifs(userId, body)
      break
    case Types.CHAT:
      body.type = Data.NotificationType.CHAT
      _push(Types.NOTIFICATION, userId, body)
      /* if (!emitEvent(eventType, userId, body.id) && !body.muted) {
        body.type = Notif.Types.CHAT
        body.refId = body.id
        _push(Types.NOTIFICATION, userId, body)
      } */
      break
    default:
      throw new Error('Unhandled notification')
  }
}

const batchPush = async (eventType, identityIds, body) => {
  const identities = await Identity.getByIds(identityIds)

  return Promise.all(
    identities.map(async (i) => {
      if (i.type === Data.IdentityType.ORG) {
        const members = await Org.miniMembers(i.id)
        return batchPush(
          eventType,
          members.map((m) => m.user_id),
          body
        )
      }

      return _push(eventType, i.id, body)
    })
  )
}

export const worker = async ({ eventType, identityId, body }) => {
  try {
    const identities = await Identity.getByIds([identityId])
    const identity = identities[0]
    body.orgin = identity
    if (identity.type === Data.IdentityType.ORG) {
      const members = await Org.miniMembers(identityId)
      return batchPush(
        eventType,
        members.map((m) => m.user_id),
        body
      )
    }
    return _push(eventType, identity.id, body)
  } catch (err) {
    logger.error(`[notify] => ${err.message}`)
  }
}
