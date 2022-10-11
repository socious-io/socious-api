import supertest from 'supertest';
import {app} from '../../src/index.js';
import {login, register, profile} from './methods/user.js'

let server, request;

beforeAll(() => {
  server = app.listen();
  request = supertest(server);
});



const cleanup = async () => {
  await app.db.query(`DELETE FROM users`)
  await app.db.pool.end()  
}


test('register', async () => await register(request));
test('login', async () => await login(request));
test('profile', async () => await profile(request));

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done);
  })
});
