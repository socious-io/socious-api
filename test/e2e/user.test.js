import request from 'supertest';
import sql from 'sql-template-tag';
import {app} from '../../src/index.js';
import Data from '../data/index.js';

test('register', async () => {
  const response = await await request(app.callback())
    .post('/auth/register')
    .send({
      username: Data.user.username,
      first_name: Data.user.first_name,
      last_name: Data.user.last_name,
      email: Data.user.email,
      password: Data.user.password,
    });

  // make user same as snapped
  await app.db.query(sql`DELETE FROM otps`);
  await app.db.query(sql`
    UPDATE users 
      SET id=${Data.user.id},
      created_at=${Data.user.created_at},
      updated_at=${Data.user.updated_at} 
    WHERE email=${Data.user.email}`);

  expect(response.status).toBe(200);
  expect(response.body.access_token).not.toBeNull();
  expect(response.body.refresh_token).not.toBeNull();
  expect(response.body.refresh_token).not.toBeNull();
  expect(response.body.token_type).toBe('Bearer');
});

test('login', async () => {
  const response = await await request(app.callback())
    .post('/auth/login')
    .send({
      email: Data.user.email,
      password: Data.user.password,
    });
  Data.user.access_token = response.body.access_token;
  expect(response.status).toBe(200);
  expect(response.body.access_token).not.toBeNull();
  expect(response.body.refresh_token).not.toBeNull();
  expect(response.body.refresh_token).not.toBeNull();
  expect(response.body.token_type).toBe('Bearer');
});

test('profile', async () => {
  const response = await await request(app.callback())
    .get('/user/profile')
    .set('Authorization', Data.user.access_token);

  expect(response.status).toBe(200);
  expect(response.body).toMatchSnapshot();
});
