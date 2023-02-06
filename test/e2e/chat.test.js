import supertest from 'supertest'
import { app } from '../../src/index.js'
import data from '../data/index.js'
import { registerAndVerify } from './globals/user.js'
import { create as createOrg } from './globals/org.js'

let server, request

beforeAll(async () => {
  server = app.listen()
  request = supertest(server)

  await registerAndVerify(request, data)
  await createOrg(request, data)
})

test('start chat', async () => {
  const response = await request
    .post('/chats')
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[1].id)
    .send({
      name: 'test',
      type: 'CHAT',
      participants: [data.orgs[0].id]
    })

  expect(response.status).toBe(200)

  const chatsRes = await request
    .get('/chats')
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)

  expect(chatsRes.status).toBe(200)

  expect(chatsRes.body.items.filter((c) => c.id === response.body.id)).toHaveLength(1)

  const chatsRes2 = await request
    .get(`/chats/${response.body.id}`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)

  expect(chatsRes2.status).toBe(200)

  const chatsRes3 = await request
    .get(`/chats/${response.body.id}`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[1].id)

  expect(chatsRes3.status).toBe(200)

  const chatsRes4 = await request.get('/chats').set('Authorization', data.users[0].access_token)

  expect(chatsRes4.body.items.filter((c) => c.id === response.body.id)).toHaveLength(0)

  const getOneRes = await request.get(`/chats/${response.body.id}`).set('Authorization', data.users[1].access_token)

  expect(getOneRes.status).toBe(403)
})

const cleanup = async () => {
  await app.db.query('DELETE FROM users')
  await app.db.query('DELETE FROM organizations')
  await app.db.pool.end()
}

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done)
  })
})
