import Config from '../../config.js';
import {getByUsername} from './read.js';
import {insert} from './write.js';
import * as bcrypt from 'bcrypt';
import {NotMatchedError} from '../../utils/errors.js';
import jwt from 'jsonwebtoken';
import {authSchem, registerSchem} from './schema.js';

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
