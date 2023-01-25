import supertest from 'supertest'
import { app } from '../../src/index.js'
import data from '../data/index.js'
import { registerAndVerify } from './globals/user.js'

let server, request

beforeAll(async () => {
  server = app.listen()
  request = supertest(server)

  await registerAndVerify(request, data)
})

test('update settings', async () => {
  const response = await request
    .post('/notifications/settings')
    .set('Authorization', data.users[0].access_token)
    .send({
      settings: [
        {
          type: 'COMMENT',
          in_app: true,
          push: false,
          email: false
        },
        {
          type: 'APPLICATION',
          in_app: true,
          push: true,
          email: true
        }
      ]
    })

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot()
})

test('get settings', async () => {
  const response = await request
    .get('/notifications/settings')
    .set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot()
})

const cleanup = async () => {
  await app.db.query('DELETE FROM users')
  await app.db.pool.end()
}

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done)
  })
})
