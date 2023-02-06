import Config from '../config.js'
import { Server as Socket } from 'socket.io'
import http from 'http'
import Auth from '../services/auth/index.js'
import { UnauthorizedError } from './errors.js'

const socketSessions = (app) => {
  return (socket, next) => {
    // create a new (fake) Koa context to decrypt the session cookie
    const ctx = app.createContext(socket.request, new http.OutgoingMessage())
    socket.session = ctx.session
    return next()
  }
}

const socketLoginRequired = async (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization || socket.session.token

  if (!token) return next(new UnauthorizedError())

  try {
    const { id } = await Auth.verifyToken(token)
    // TODO: we can fetch user if need
    // socket.user = await User.get(id);
    socket.userId = id
  } catch {
    return next(new UnauthorizedError())
  }
  return next()
}

export default (app) => {
  app.socket = new Socket(app.http, Config.socket)
  app.socket.use(socketSessions(app))
  app.socket.use(socketLoginRequired)

  /*
socket handler will push every auth users connection ids to app.users
will purge it when connection closed
*/
  app.socket.on('connect', async (socket) => {
    const socketId = socket.id
    const userId = socket.userId

    if (!app.users[userId]) app.users[socket.userId] = []
    app.users[userId].push(socketId)

    socket.on('disconnect', () => {
      const index = app.users[userId].indexOf(socketId)
      app.users[userId].splice(index, 1)
    })
  })
}
