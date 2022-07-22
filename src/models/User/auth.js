import Config from '../../config.js';
import {getByEmail, getByPhone, getByUsername, getOTP} from './read.js';
import {insert, createOTP, verifyOTP, verifyEmail, verifyPhone} from './write.js';
import * as bcrypt from 'bcrypt';
import {AuthorizationError, NotMatchedError} from '../../utils/errors.js';
import jwt from 'jsonwebtoken';
import { OTPType, UserStatus } from './enum.js';
import {authSchem, registerSchem, newOTPSchem} from './schema.js';

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

  if (user.status === UserStatus.SUSPEND) throw new AuthorizationError('User has been suspended!')

  return {access_token: signin(user)};
};

export const register = async (body) => {
  await registerSchem.validate(body);
  body.password = await hashPassword(body.password);
  const user = await insert(body.username, body.email, body.password);

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

  // TODO: Sending queue for email or sms push
};

export const confirmOTP = async (code) => {
  const otp = await getOTP(code);
  
  await verifyOTP(otp.id);

  if (otp.type === OTPType.EMAIL) await verifyEmail(otp.user_id);
  if (otp.type === OTPType.PHONE) await verifyPhone(otp.user_id);

  return {access_token: signin({id: otp.user_id})};
};
