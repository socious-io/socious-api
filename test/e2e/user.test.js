import supertest from 'supertest';
import {app} from '../../src/index.js';
import data from '../data/index.js';
import {login, register, profile} from './globals/user.js';

let server, request;

beforeAll(() => {
  server = app.listen();
  request = supertest(server);
});

test('register', async () => register(request, data));
test('login', async () => login(request, data));
test('profile', async () => profile(request, data));

const cleanup = async () => {
  await app.db.query(`DELETE FROM users`);
  await app.db.pool.end();
};

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done);
  });
});
