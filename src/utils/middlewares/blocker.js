import { TooManyRequestsError } from '../errors.js'

const retryBlockerData = {}
/**
 * This would work on all routes that use this middlware would block and send 429 http error
 * after retryCount exceed would refresh ip after reset timer.
 *
 * @param root0
 * @param root0.resetTimer
 * @param root0.blockerTimer
 * @param root0.retryCount
 * @example
 */
export default ({ resetTimer, blockerTimer, retryCount }) =>
  async (ctx, next) => {
    let error
    // Note: This must be overide on Nginx
    const ip = ctx.request.header['x-real-ip'] || ctx.request.ip
    const now = new Date()

    if (retryBlockerData[ip]?.blocked < new Date(now.getTime() + blockerTimer).getTime()) {
      throw new TooManyRequestsError()
    }

    if (retryBlockerData[ip]?.blocked || retryBlockerData[ip]?.reset < now.getTime()) {
      delete retryBlockerData[ip]
    }

    try {
      await next()
    } catch (err) {
      error = err
    }

    if (!retryBlockerData[ip]?.retry) {
      retryBlockerData[ip] = {}
      retryBlockerData[ip].retry = 0
    }

    if (ctx.status < 500) {
      retryBlockerData[ip].reset = now.getTime() + resetTimer
      retryBlockerData[ip].retry++
    }

    if (retryBlockerData[ip].retry > retryCount) {
      retryBlockerData[ip].blocked = now.getTime() + blockerTimer
    }

    if (error) throw error
  }
