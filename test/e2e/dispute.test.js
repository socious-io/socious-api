import supertest from 'supertest'
import { app } from '../../src/index.js'
import data from '../data/index.js'
import { registerAndVerify } from './globals/user.js'
import { create as createOrg } from './globals/org.js'
import sql, { raw } from 'sql-template-tag'
import { create as createProjects, apply, addQuestion, offer, hire, approve } from './globals/project.js'

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

async function createContributionInvitations() {
  //Getting Users in the same order
  const contributorId = (await app.db.get(sql`SELECT * FROM users WHERE email=${data.users[0].email}`)).id,
    invitations = []

  data.disputes.objects.forEach((dispute) => {
    invitations.push({ dispute_id: dispute.id, contributor_id: contributorId })
  })

  const { rows } = await app.db.query(
    raw(
      `INSERT INTO dispute_contributor_invitations
      (${Object.keys(invitations[0])})
      VALUES ${invitations
        .map(
          (invitation) =>
            '(' +
            Object.values(invitation)
              .map((value) => `'${value}'`)
              .join(',') +
            ')'
        )
        .join(',\n')}
        RETURNING *
        `
    )
  )
  data.disputes.invitations = rows
}

beforeAll(async () => {
  server = app.listen()
  request = supertest(server)

  await registerAndVerify(request, data)
  await createOrg(request, data)
  await createEvidences(data.disputes.documents, data.orgs[0].id)
  await createProjects(request, data)
  await addQuestion(request, data)
  await apply(request, data)
  await offer(request, data)
  await approve(request, data)
  await hire(request, data)

  //Get Offers
  data.projects.offers = []
  for (const user of data.users) {
    if (user.invalid) continue
    data.projects.offers = [
      ...data.projects.offers,
      ...(await request.get('/user/offers').set('Authorization', user.access_token)).body.items
    ]
  }

  data.disputes.categories = (await request.get('/disputes/categories')).body
})

test('issue a dispute', async () => {
  const otherCategory = data.disputes.categories.find((category) => category.name === 'Others')
  const mission = data.projects.offers[0].mission

  const response = await request
    .post('/disputes')
    .set('Authorization', data.users[0].access_token)
    .send({
      title: 'dispute #1',
      description: 'same as initial message',
      respondent_id: data.orgs[0].id,
      mission_id: mission.id,
      category_id: otherCategory.id,
      evidences: data.disputes.documents.map((dispute) => dispute.id)
    })

  data.disputes.objects.push(response.body)
  console.log(response.body)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    category: {
      id: expect.any(String),
      name: expect.any(String)
    },
    contract: {
      id: expect.any(String),
      name: expect.any(String)
    },
    title: expect.any(String),
    state: expect.any(String),
    direction: expect.any(String),
    claimant: expect.any(Object),
    respondent: expect.any(Object),
    events: expect.any(Array),
    created_at: expect.any(String),
    updated_at: expect.any(String)
  })

  //Send invitations
  await createContributionInvitations()
})

test('get a dispute', async () => {
  const response = await request
    .get(`/disputes/${data.disputes.objects[0].id}`)
    .set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    category: {
      id: expect.any(String),
      name: expect.any(String)
    },
    contract: {
      id: expect.any(String),
      name: expect.any(String)
    },
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
    category: {
      id: expect.any(String),
      name: expect.any(String)
    },
    contract: {
      id: expect.any(String),
      name: expect.any(String)
    },
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
    category: {
      id: expect.any(String),
      name: expect.any(String)
    },
    contract: {
      id: expect.any(String),
      name: expect.any(String)
    },
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
        category: {
          id: expect.any(String),
          name: expect.any(String)
        },
        contract: {
      id: expect.any(String),
      name: expect.any(String)
    },
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
    category: {
      id: expect.any(String),
      name: expect.any(String)
    },
    contract: {
      id: expect.any(String),
      name: expect.any(String)
    },
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

//TODO: voting

test('getting all of the dispute contribution invitations', async () => {
  const response = await request.get(`/disputes/invitations`).set('Authorization', data.users[0].access_token).send()

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        dispute_id: expect.any(String),
        status: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
    ]
  })
})

test('getting one of the dispute contribution invitations', async () => {
  const response = await request
    .get(`/disputes/invitations/${data.disputes.invitations[0].id}`)
    .set('Authorization', data.users[0].access_token)
    .send()

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    dispute_id: expect.any(String),
    status: expect.any(String),
    created_at: expect.any(String),
    updated_at: expect.any(String)
  })
})

test('declining the dispute contribution invitation', async () => {
  const response = await request
    .post(`/disputes/invitations/${data.disputes.invitations[0].id}/decline`)
    .set('Authorization', data.users[0].access_token)
    .send()

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    dispute_id: expect.any(String),
    status: expect.any(String),
    created_at: expect.any(String),
    updated_at: expect.any(String)
  })
})

test('accepting the dispute contribution invitation', async () => {
  const response = await request
    .post(`/disputes/invitations/${data.disputes.invitations[0].id}/accept`)
    .set('Authorization', data.users[0].access_token)
    .send()

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    dispute_id: expect.any(String),
    status: expect.any(String),
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
  cleanup().then(() => {
    server.close(done)
  })
})
