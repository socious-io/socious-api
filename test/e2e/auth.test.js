import fs from 'fs/promises';
import request from 'supertest';
import {app} from '../../src/index.js';



beforeAll(async () => {
  fs.readFile('../')
})


test('auth works', async () => {
  const response = await (await request(app.callback()).post('/auth/login').send({
    "email": "info_2022@socious.io",
    "password": "socious2023"
}))
  expect(response.status).toBe(200);
  expect(response.body.access_token).not.toBeNull();
  expect(response.body.refresh_token).not.toBeNull();
  expect(response.body.refresh_token).not.toBeNull();
  expect(response.body.token_type).toBe('Bearer');
});
