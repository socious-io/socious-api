import User from '../../models/user/index.js'
import * as bcrypt from 'bcrypt'
import { signin } from './jwt.js'
import { AuthorizationError, NotMatchedError, PermissionError, ValidationError } from '../../utils/errors.js'
import {
  authSchem,
  registerSchem,
  preregisterSchem,
  newOTPSchem,
  confirmOTPSchem,
  changePasswordSchem,
  directChangePasswordSchem
} from './schema.js'
import publish from '../jobs/publish.js'
import { OTPPurposeType, OTPType, createOTP, verifyOTP, getOTP } from './otp.js'
import config from '../../config.js'
import { isTestEmail } from '../email/index.js'
import Analytics from '../analytics/index.js'

const generateUsername = (email) => {
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${email
    .replace(/@.*$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/, '-')
    .replace(/[._-]{2,}/, '-')
    .slice(0, 20)}${rand}`
}

export const hashPassword = (salt) => {
  return bcrypt.hash(salt, 12)
}

export const comparePassword = (salt, hashed) => {
  return bcrypt.compare(salt, hashed.replace('$2y$', '$2b$'))
}

export const basic = async (body) => {
  await authSchem.validateAsync(body)
  const { email, password } = body
  const user = await User.getByEmail(email)

  if (user.password_expired) throw new NotMatchedError()

  const matched = await comparePassword(password, user.password)
  if (!matched) throw new NotMatchedError()

  if (user.status === User.StatusType.SUSPEND) {
    throw new AuthorizationError('User has been suspended!')
  }

  return signin(user.id)
}

export const register = async (body) => {
  await registerSchem.validateAsync(body)
  if (!config.mail.allowTest && isTestEmail(body.email)) {
    throw new ValidationError('Invalid email')
  }

  if (body.password) body.password = await hashPassword(body.password)

  // Generate username with email user and 4 random digit number if username not provided
  if (!body.username) {
    const username = generateUsername(body.email)

    try {
      await User.getByUsername(username)
      // generated username already exists recursivly retry
      return register(body)
    } catch {
      body.username = username
    }
  }

  const user = await User.insert(body.first_name, body.last_name, body.username, body.email, body.password)

  // sending OTP to verify user email after registeration
  const code = await createOTP(user.id, OTPType.EMAIL, OTPPurposeType.ACTIVATION)
  publish('tmp_email', {
    to: user.email,
    subject: 'Verify your account',
    template: config.mail.templates.activation,
    kwargs: { name: user.first_name, code },
    category: 'OTP'
  })

  return user
}

export const sendOTP = async (body) => {
  await newOTPSchem.validateAsync(body)
  let user
  let otpType
  if (body.email) {
    user = await User.getByEmail(body.email)
    otpType = OTPType.EMAIL
  }
  if (body.phone) {
    user = await User.getByPhone(body.phone)
    otpType = OTPType.PHONE
  }

  const code = await createOTP(user.id, otpType)

  if (otpType === OTPType.EMAIL) {
    publish('tmp_email', {
      to: user.email,
      subject: 'One time password',
      template: config.mail.templates.otp,
      kwargs: { name: user.first_name, code },
      category: 'OTP'
    })
  }
}

export const resendVerifyCode = async (body) => {
  await newOTPSchem.validateAsync(body)

  const user = await User.getByEmail(body.email)

  const code = await createOTP(user.id, OTPType.EMAIL, OTPPurposeType.ACTIVATION)
  publish('tmp_email', {
    to: user.email,
    subject: 'Verify your account',
    template: config.mail.templates.activation,
    kwargs: { name: user.first_name, code }
  })
}

export const confirmOTP = async (body) => {
  await confirmOTPSchem.validateAsync(body)
  const user = body.email ? await User.getByEmail(body.email) : await User.getByPhone(body.phone)

  const otp = await getOTP(user.id, body.code)

  await verifyOTP(otp.id)

  if (user.status !== User.StatusType.ACTIVE) {
    Analytics.track({
      userId: user.id,
      event: 'activate_user',
      meta: {}
    })
  }

  if (otp.type === OTPType.EMAIL) await User.verifyEmail(otp.user_id)
  if (otp.type === OTPType.PHONE) await User.verifyPhone(otp.user_id)

  if (otp.purpose === OTPPurposeType.FORGET_PASSWORD) {
    await User.expirePassword(user.id)
  }

  return signin(otp.user_id)
}

export const forgetPassword = async (body) => {
  await newOTPSchem.validateAsync(body)
  let user
  let otpType

  if (body.email) {
    user = await User.getByEmail(body.email)
    otpType = OTPType.EMAIL
  }
  if (body.phone) {
    user = await User.getByPhone(body.phone)
    otpType = OTPType.PHONE
  }

  const code = await createOTP(user.id, otpType, OTPPurposeType.FORGET_PASSWORD)

  if (otpType === OTPType.EMAIL) {
    publish('tmp_email', {
      to: user.email,
      subject: 'Reset Password',
      template: config.mail.templates.forgetPassword,
      kwargs: { name: user.first_name, code },
      category: 'OTP'
    })
  }
}

export const directChangePassword = async (user, body) => {
  if (!user.password_expired && user.password) {
    throw new PermissionError('You can not change password directly')
  }

  await directChangePasswordSchem.validateAsync(body)
  const newPassword = await hashPassword(body.password)

  await User.updatePassword(user.id, newPassword)
}

export const changePassword = async (user, body) => {
  await changePasswordSchem.validateAsync(body)

  const matched = await comparePassword(body.current_password, user.password)
  if (!matched) throw new NotMatchedError()

  const newPassword = await hashPassword(body.password)
  await User.updatePassword(user.id, newPassword)
}

export const preregister = async (body) => {
  const res = {}
  const { error } = await preregisterSchem.validate(body, {
    abortEarly: false
  })
  if (error) {
    for (const errorDetails of error.details) {
      res[errorDetails.path] = errorDetails.message
    }
  }

  if (body.username && !res.username) {
    try {
      await User.getByUsername(body.username)
      res.username = 'EXISTS'
    } catch {
      res.username = null
    }
  }

  if (body.email && !res.email) {
    try {
      await User.getByEmail(body.email)
      res.email = 'EXISTS'
    } catch {
      res.email = null
    }
  }

  return res
}
