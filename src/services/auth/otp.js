import sql from 'sql-template-tag'
import logger from '../../utils/logging.js'
import { app } from '../../index.js'
import User from '../../models/user/index.js'

export const OTPType = {
  EMAIL: 'EMAIL',
  PHONE: 'PHONE'
}

export const OTPPurposeType = {
  AUTH: 'AUTH',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
  ACTIVATION: 'ACTIVATION'
}

export const getOTP = async (user_id, code) => {
  const query = sql`
  SELECT otps.* FROM otps 
  INNER JOIN users ON users.id=otps.user_id 
  WHERE 
    otps.user_id=${user_id} AND
    otps.code=${code} AND otps.expired_at > now() AND 
    otps.verified_at IS NULL AND users.status != ${User.StatusType.SUSPEND}
  `
  return app.db.get(query)
}

export const verifyOTP = async (id) => {
  await app.db.query(sql`UPDATE otps SET verified_at=now() WHERE id=${id}`)
}

export const createOTP = async (userId, otpType, otpPurpose = OTPPurposeType.AUTH) => {
  // generate random 6 digit number
  const code = Math.floor(100000 + Math.random() * 900000)
  await app.db.query(
    sql`INSERT INTO otps (code, user_id, type, purpose) VALUES (${code}, ${userId}, ${otpType}, ${otpPurpose})`
  )
  logger.info(`OTP Code generated for ${userId} => ${code}`)
  return code
}
