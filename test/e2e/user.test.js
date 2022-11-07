import supertest from 'supertest';
import {app} from '../../src/index.js';
import data from '../data/index.js';
import {
  login,
  register,
  profile,
  addLanguage,
  addExperience,
  updateExperience,
  updateLanguage,
  profileByUsername,
  updateProfile,
  verifyUser,
} from './globals/user.js';

let server, request;

beforeAll(async () => {
  server = app.listen();
  request = supertest(server);
});

test('register', async () => register(request, data));
test('verify', async () => verifyUser(request, data));
test('login', async () => login(request, data));
test('add language', async () => addLanguage(request, data));
test('add experience', async () => addExperience(request, data));
test('profile', async () => profile(request, data));
test('update language', async () => updateLanguage(request, data));
test('update experience', async () => updateExperience(request, data));
test('profile by username', async () => profileByUsername(request, data));
test('update profile', async () => updateProfile(request, data));

const cleanup = async () => {
  await app.db.query(`DELETE FROM users`);
  await app.db.query(`DELETE FROM organizations`);
  await app.db.pool.end();
};

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done);
  });
});
