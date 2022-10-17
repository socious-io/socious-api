import supertest from 'supertest';
import {app} from '../../src/index.js';
import data from '../data/index.js';
import {register} from './globals/user.js';
import {create as createOrg} from './globals/org.js';
import {
  create,
  get,
  getApplicant,
  addQuestion,
  apply,
  offer,
  reject,
  approve,
  hire,
} from './globals/project.js';

let server, request;

beforeAll(async () => {
  server = app.listen();
  request = supertest(server);

  await register(request, data);
  await createOrg(request, data);
});

test('create', async () => create(request, data));
// test('get', async () => get(request, data));
test('add questions', async () => addQuestion(request, data));
test('apply', async () => apply(request, data));
test('get applicants', async () => getApplicant(request, data));
test('offer', async () => offer(request, data));
test('reject', async () => reject(request, data));
test('approve', async () => approve(request, data));
test('hire', async () => hire(request, data));

const cleanup = async () => {
  await app.db.query(`DELETE FROM users`);
  await app.db.query(`DELETE FROM organizations`);
  await app.db.query(`DELETE FROM projects`);
  await app.db.pool.end();
};

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done);
  });
});
