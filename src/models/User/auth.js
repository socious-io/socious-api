import Config from '../../config.js';
import {get, getByEmail, getByPhone, getByUsername, getOTP} from './read.js';
import {
  insert,
  createOTP,
  verifyOTP,
  verifyEmail,
  verifyPhone,
  updatePassword,
  expirePassword,
} from './write.js';
import * as bcrypt from 'bcrypt';
import {
  AuthorizationError,
  NotMatchedError,
  PermissionError,
  ValidationError,
} from '../../utils/errors.js';
import jwt from 'jsonwebtoken';
import {OTPType, UserStatus} from './enum.js';
import {
  authSchem,
  registerSchem,
  newOTPSchem,
  changePasswordSchem,
  diretChangePasswordSchem,
} from './schema.js';
import publish from '../../services/jobs/publish.js';

const signin = (user) => {
  return jwt.sign({id: user.id}, Config.secret, {
    expiresIn: Config.jwtExpireTime,
  });
};

export const hashPassword = (salt) => {
  return bcrypt.hash(salt, 12);
};

export const comparePassword = (salt, hashed) => {
  return bcrypt.compare(salt, hashed.replace('$2y$', '$2b$'));
};

export const auth = async (body) => {
  await authSchem.validateAsync(body);
  const {email, password} = body;
  const user = await getByEmail(email);

  if (user.password_expired) throw new NotMatchedError();

  const matched = await comparePassword(password, user.password);
  if (!matched) throw new NotMatchedError();

  if (user.status === UserStatus.SUSPEND)
    throw new AuthorizationError('User has been suspended!');

  return {access_token: signin(user)};
};

export const register = async (body) => {
  await registerSchem.validateAsync(body);

  body.password = await hashPassword(body.password);
  const user = await insert(
    body.first_name,
    body.last_name,
    body.username,
    body.email,
    body.password,
  );

  // sending OTP to verify user email after registeration
  const code = await createOTP(user.id, OTPType.EMAIL);
  publish('email', {
    to: user.email,
    subject: 'Verify your account',
    template: 'templates/emails/active_user.html',
    kwargs: {name: 'test', code},
  });
  return {access_token: signin(user)};
};

export const sendOTP = async (body) => {
  await newOTPSchem.validateAsync(body);
  let user;
  let otpType;
  if (body.email) {
    user = await getByEmail(body.email);
    otpType = OTPType.EMAIL;
  }
  if (body.phone) {
    user = await getByPhone(body.phone);
    otpType = OTPType.PHONE;
  }

  const code = await createOTP(user.id, otpType);

  if (otpType === OTPType.EMAIL) {
    publish('email', {
      to: user.email,
      subject: 'OTP',
      template: 'templates/emails/otp.html',
      kwargs: {name: 'test', code},
    });
  }
};

export const confirmOTP = async (code) => {
  const otp = await getOTP(code);

  await verifyOTP(otp.id);

  if (otp.type === OTPType.EMAIL) await verifyEmail(otp.user_id);
  if (otp.type === OTPType.PHONE) await verifyPhone(otp.user_id);

  return {access_token: signin({id: otp.user_id})};
};

export const forgetPassword = async (body) => {
  await newOTPSchem.validateAsync(body);
  let user;
  let otpType;

  if (body.email) {
    user = await getByEmail(body.email);
    otpType = OTPType.EMAIL;
  }
  if (body.phone) {
    user = await getByPhone(body.phone);
    otpType = OTPType.PHONE;
  }

  const code = await createOTP(user.id, otpType);

  if (otpType === OTPType.EMAIL) {
    publish('email', {
      to: user.email,
      subject: 'OTP',
      template: 'templates/emails/forget_password.html',
      kwargs: {name: 'test', code},
    });
  }

  await expirePassword(user.id);
};

export const directChangePassword = async (userId, body) => {
  const user = await get(userId);

  if (!user.password_expired)
    throw new PermissionError('You can not change password directly');

  await diretChangePasswordSchem.validateAsync(body);
  const newPassword = await hashPassword(body.password);

  await updatePassword(userId, newPassword);
};

export const changePassword = async (userId, body) => {
  await changePasswordSchem.validateAsync(body);
  const user = await get(userId);

  const matched = await comparePassword(body.current_password, user.password);
  if (!matched) throw new NotMatchedError();

  const newPassword = await hashPassword(body.password);
  await updatePassword(userId, newPassword);
};
