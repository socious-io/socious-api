import supertest from 'supertest';
import {app} from '../../src/index.js';
import data from '../data/index.js';
import {register} from './globals/user.js';
import {create, getAll, getFiltered} from './globals/org.js';

let server, request;

beforeAll(async () => {
  server = app.listen();
  request = supertest(server);

  await register(request, data);
});

test('create', async () => create(request, data));
test('get all', async () => getAll(request, data));
test('get filtered', async () => getFiltered(request, data));

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
