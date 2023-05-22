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

test('connect request', async () => {
  for (const i in data.users) {
    if (data.users[i].invalid) continue

    for (const j in data.orgs) {
      if (data.orgs[j].invalid || !data.orgs[j].id) continue

      const response = await request
        .post(`/connections/${data.orgs[j].id}`)
        .set('Authorization', data.users[i].access_token)
        .send({
          text: 'test'
        })

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        relation_id: expect.any(String),
        requested_id: expect.any(String),
        requester_id: expect.any(String),
        requested: expect.any(Object),
        requester: expect.any(Object),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    }
  }
})

test('block connection', async () => {
  for (const i in data.orgs) {
    if (data.orgs[i].invalid || !data.orgs[i].id) continue

    const response = await request
      .get('/connections')
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[i].id)

    expect(response.status).toBe(200)
    expect(response.body.total_count).toBe(2)

    const blockRes = await request
      .post(`/connections/${response.body.items[0].id}/block`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[i].id)

    expect(blockRes.status).toBe(200)
    expect(blockRes.body).toMatchSnapshot({
      id: expect.any(String),
      relation_id: expect.any(String),
      requested_id: expect.any(String),
      requester_id: expect.any(String),
      requested: expect.any(Object),
      requester: expect.any(Object),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    })
  }
})

test('accept connect request', async () => {
  for (const i in data.orgs) {
    if (data.orgs[i].invalid || !data.orgs[i].id) continue

    const response = await request
      .get('/connections')
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[i].id)

    expect(response.status).toBe(200)

    expect(response.body.total_count).toBe(2)

    const acceptRes = await request
      .post(`/connections/${response.body.items[1].id}/accept`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[i].id)

    expect(acceptRes.status).toBe(200)
    expect(acceptRes.body).toMatchSnapshot({
      id: expect.any(String),
      relation_id: expect.any(String),
      requested_id: expect.any(String),
      requester_id: expect.any(String),
      requested: expect.any(Object),
      requester: expect.any(Object),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      connected_at: expect.any(String)
    })
  }
})

test('filter connect requests blocked', async () => {
  for (const i in data.orgs) {
    if (data.orgs[i].invalid || !data.orgs[i].id) continue

    const response = await request
      .get('/connections?filter.status=BLOCKED')
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[i].id)

    expect(response.status).toBe(200)

    expect(response.body.total_count).toBe(1)
  }
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
