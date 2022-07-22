import Config from '../../config.js';
import {getByEmail, getByPhone, getByUsername, getOTP} from './read.js';
import {insert, createOTP, verifyOTP} from './write.js';
import * as bcrypt from 'bcrypt';
import {NotMatchedError} from '../../utils/errors.js';
import jwt from 'jsonwebtoken';
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
  if (body.email) user = await getByEmail(body.email);
  if (body.phone) user = await getByPhone(body.phone);

  const code = await createOTP(user.id);
  console.log(`OTP Code generated for ${user.id} => ${code}`);

  // TODO: Sending queue for email or sms push
};

export const confirmOTP = async (code) => {
  const otp = await getOTP(code);
  await verifyOTP(otp.id);

  return {access_token: signin({id: otp.user_id})};
};
