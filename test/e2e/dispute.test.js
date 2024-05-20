import supertest from 'supertest'
import { app } from '../../src/index.js'
import data from '../data/index.js'
import { registerAndVerify } from './globals/user.js'
import { create as createOrg } from './globals/org.js'
import { raw } from 'sql-template-tag'

let server, request

function createEvidences(documents, identityId) {
  for (const document of documents) document.identity_id = identityId
  app.db.query(
    raw(
      `INSERT INTO media (${Object.keys(documents[0])}) VALUES ${documents
        .map(
          (document) =>
            '(' +
            Object.values(document)
              .map((value) => `'${value}'`)
              .join(',') +
            ')'
        )
        .join(',\n')}`
    )
  )
}

beforeAll(async () => {
  server = app.listen()
  request = supertest(server)

  await registerAndVerify(request, data)
  await createOrg(request, data)
  await createEvidences(data.disputes.documents, data.orgs[0].id)
})

test('issue a dispute', async () => {
  const response = await request
    .post('/disputes')
    .set('Authorization', data.users[0].access_token)
    .send({
      title: 'dispute #1',
      description: 'same as initial message',
      respondent_id: data.orgs[0].id,
      evidences: data.disputes.documents.map((dispute) => dispute.id)
    })

  data.disputes.objects.push(response.body)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    title: expect.any(String),
    state: expect.any(String),
    direction: expect.any(String),
    claimant: expect.any(Object),
    respondent: expect.any(Object),
    events: expect.any(Array),
    created_at: expect.any(String),
    updated_at: expect.any(String)
  })
})

test('put message on a dispute', async () => {
  const response = await request
    .post(`/disputes/${data.disputes.objects[0].id}/message`)
    .set('Authorization', data.users[0].access_token)
    .send({
      message: 'Message #1',
      evidences: data.disputes.documents.map((dispute) => dispute.id)
    })

  data.disputes.objects[0] = response.body

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    title: expect.any(String),
    state: expect.any(String),
    direction: expect.any(String),
    claimant: expect.any(Object),
    respondent: expect.any(Object),
    events: expect.any(Array),
    created_at: expect.any(String),
    updated_at: expect.any(String)
  })
})

test('put response on a dispute', async () => {
  const response = await request
    .post(`/disputes/${data.disputes.objects[0].id}/response`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)
    .send({
      message: 'Response #1',
      evidences: data.disputes.documents.map((dispute) => dispute.id)
    })

  data.disputes.objects[0] = response.body

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    title: expect.any(String),
    state: expect.any(String),
    direction: expect.any(String),
    claimant: expect.any(Object),
    respondent: expect.any(Object),
    events: expect.any(Array),
    created_at: expect.any(String),
    updated_at: expect.any(String)
  })
})

test('get all disputes as climant', async () => {
  const response = await request.get(`/disputes`).set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        title: expect.any(String),
        state: expect.any(String),
        direction: expect.any(String),
        claimant: expect.any(Object),
        respondent: expect.any(Object),
        events: expect.any(Array),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
    ]
  })
})

test('withdraw from a dispute', async () => {
  const response = await request
    .post(`/disputes/${data.disputes.objects[0].id}/withdraw`)
    .set('Authorization', data.users[0].access_token)
    .send()

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    title: expect.any(String),
    state: expect.any(String),
    direction: expect.any(String),
    claimant: expect.any(Object),
    respondent: expect.any(Object),
    events: expect.any(Array),
    created_at: expect.any(String),
    updated_at: expect.any(String)
  })
})

const cleanup = async () => {
  await app.db.query('DELETE FROM users')
  await app.db.query('DELETE FROM organizations')
  await app.db.query('DELETE FROM disputes')
  await app.db.pool.end()
}

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done)
  })
})
