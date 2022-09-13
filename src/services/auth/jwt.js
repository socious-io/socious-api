import sql from 'sql-template-tag';
import {app} from '../../index.js';
import Config from '../../config.js';
import Jwt from 'jsonwebtoken';
import {UnauthorizedError} from '../../utils/errors.js';

export const getToken = (id, refresh = false) => {
  return Jwt.sign({id: id, refresh}, Config.secret, {
    expiresIn: refresh ? Config.jwtRefreshExpireTime : Config.jwtExpireTime,
  });
};

export const verifyToken = async (token, refresh = false) => {
  token = token.replace('Bearer', '');
  if (refresh) {
    const {rows} = await app.db.query(
      sql`SELECT * FROM tokens_blacklist WHERE token=${token}`,
    );
    if (rows.length > 0) throw new UnauthorizedError();
  }

  const verfied = Jwt.verify(token, Config.secret);
  if (verfied.refresh != refresh) throw new UnauthorizedError();

  return verfied;
};

export const expireRefreshToken = async (token) => {
  const verified = await verifyToken(token, true);

  const {rows} = await app.db.query(sql`
    INSERT INTO tokens_blacklist (token, expires_at)
    VALUES (${token}, ${new Date(verified.exp * 1000)})
    RETURNING id
  `);
  if (rows.length < 1) throw new UnauthorizedError();

  return verified;
};

export const signin = async (id) => {
  return {
    access_token: getToken(id),
    refresh_token: getToken(id, true),
    token_type: 'Bearer',
  };
};

export const refreshToken = async (token) => {
  const {id} = await expireRefreshToken(token);
  return signin(id);
};
