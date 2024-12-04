import sql from 'sql-template-tag'
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

  await app.db.query(sql`UPDATE organizations SET verified=true WHERE id=${data.orgs[0].id}`)
})

test('register referred by verified org', async () => {
  const response = await request.post(`/auth/register?referred_by=${data.orgs[0].id}`).send({
    username: 'test_username_referred',
    first_name: data.users[0].first_name,
    last_name: data.users[0].last_name,
    email: 'test_referred2@referred.com',
    password: data.users[0].password
  })
  expect(response.status).toBe(200)
})

test('create org referred by verified org', async () => {
  const response = await request
    .post(`/orgs?referred_by=${data.orgs[0].id}`)
    .set('Authorization', data.users[0].access_token)
    .send({
      name: 'test ORG',
      bio: 'test',
      description: 'test',
      email: 'test_referred@socious.io',
      phone: '9899993',
      city: 'Tehran',
      type: 'SOCIAL',
      address: 'address',
      website: 'http://test.com',
      social_causes: ['SOCIAL', 'MENTAL'],
      country: 'IR',
      mission: 'test',
      culture: 'test'
    })
  expect(response.status).toBe(200)
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
