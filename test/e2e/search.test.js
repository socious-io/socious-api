import supertest from 'supertest'
import { app } from '../../src/index.js'
import data from '../data/index.js'
import { registerAndVerify } from './globals/user.js'
import { create as createOrg } from './globals/org.js'
import { create as createProject } from './globals/project.js'

let server, request

beforeAll(async () => {
  server = app.listen()
  request = supertest(server)

  await registerAndVerify(request, data)
  await createOrg(request, data)
  await createProject(request, data)
})

test('search projects', async () => {
  const response = await request
    .post('/search')
    .set('Authorization', data.users[0].access_token)
    .send({
      q: 'test',
      type: 'projects'
    })
  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        created_at: expect.any(String),
        updated_at: expect.any(String),
        id: expect.any(String),
        identity_id: expect.any(String),
        identity_meta: expect.any(Object),
        job_category_id: expect.any(String),
        job_category: expect.any(Object)
      },
      {
        created_at: expect.any(String),
        updated_at: expect.any(String),
        id: expect.any(String),
        identity_id: expect.any(String),
        identity_meta: expect.any(Object),
        job_category_id: expect.any(String),
        job_category: expect.any(Object)
      }
    ]
  })
})

test('projects with filter', async () => {
  const response = await request
    .post('/search')
    .set('Authorization', data.users[0].access_token)
    .send({
      type: 'projects',
      filter: {
        payment_currency: 'USD'
      }
    })
  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        created_at: expect.any(String),
        updated_at: expect.any(String),
        id: expect.any(String),
        identity_id: expect.any(String),
        identity_meta: expect.any(Object),
        job_category_id: expect.any(String),
        job_category: expect.any(Object)
      }
    ]
  })
})

const cleanup = async () => {
  await app.db.query('DELETE FROM users')
  await app.db.query('DELETE FROM organizations')
  await app.db.query('DELETE FROM projects')
  await app.db.pool.end()
}

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done)
  })
})
