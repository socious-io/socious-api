import Config from '../../config.js';
import {getByEmail, getByPhone, getByUsername, getOTP} from './read.js';
import {
  insert,
  createOTP,
  verifyOTP,
  verifyEmail,
  verifyPhone,
} from './write.js';
import * as bcrypt from 'bcrypt';
import {AuthorizationError, NotMatchedError} from '../../utils/errors.js';
import jwt from 'jsonwebtoken';
import {OTPType, UserStatus} from './enum.js';
import {authSchem, registerSchem, newOTPSchem} from './schema.js';
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
  await authSchem.validate(body);
  const {username, password} = body;
  const user = await getByUsername(username);
  const matched = await comparePassword(password, user.password);

  if (!matched) throw new NotMatchedError();

  if (user.status === UserStatus.SUSPEND)
    throw new AuthorizationError('User has been suspended!');

  return {access_token: signin(user)};
};

export const register = async (body) => {
  await registerSchem.validate(body);
  body.password = await hashPassword(body.password);
  const user = await insert(body.username, body.email, body.password);

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
  await newOTPSchem.validate(body);
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
  console.log(`OTP Code generated for ${user.id} => ${code}`);

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
