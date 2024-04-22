import { raw } from 'sql-template-tag'
import { app } from '../../../src'

export const create = async (request, data) => {
  for (const i in data.orgs) {
    const body = JSON.parse(JSON.stringify(data.orgs[i]))
    delete body.invalid

    const response = await request.post('/orgs').set('Authorization', data.users[0].access_token).send(body)

    if (data.orgs[i].invalid) {
      expect(response.status).toBe(400)
      expect(response.body).toMatchSnapshot()
    } else {
      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: expect.any(String),
        shortname: expect.any(String),
        search_tsv: expect.any(String)
      })

      data.orgs[i].id = response.body.id
    }
  }
}

export const kybRequest = async (request, data) => {
  const random_org = data.orgs[0],
    documents = data.medias.kyb_documents

  for (const document of documents) document.identity_id = random_org.id
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

  const response = await request
    .post('/credentials/verifications/org')
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', random_org.id)
    .send({
      documents: documents.map((document) => document.id)
    })
  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    created_at: expect.any(String),
    updated_at: expect.any(String),
    identity_id: expect.any(String),
    status: expect.stringMatching('PENDING'),
    documents: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        media_id: expect.any(String),
        verification_id: expect.any(String)
      })
    ])
  })
}

export const kybRequestFetch = async (request, data) => {
  const random_org = data.orgs[0]

  const response = await request
    .get('/credentials/verifications/org')
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', random_org.id)
    .send()

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    id: expect.any(String),
    created_at: expect.any(String),
    updated_at: expect.any(String),
    identity_id: expect.any(String),
    status: expect.stringMatching('PENDING'),
    documents: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        url: expect.any(String),
        filename: expect.any(String),
        created_at: expect.any(String)
      })
    ])
  })
}

export const getAll = async (request, data) => {
  const response = await request.get('/orgs').set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: expect.any(String),
        shortname: expect.any(String),
        search_tsv: expect.any(String)
      },
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: expect.any(String),
        shortname: expect.any(String),
        search_tsv: expect.any(String)
      }
    ]
  })
}

export const getFiltered = async (request, data) => {
  const response = await request
    .get('/orgs?filter.country=JP,US&filter.social_causes=SOCIAL,HEALTH')
    .set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: expect.any(String),
        shortname: expect.any(String),
        search_tsv: expect.any(String)
      }
    ]
  })
}

export const hiring = async (request, data) => {
  const response = await request
    .post(`/orgs/hiring`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)
  expect(response.status).toBe(200)
  expect(response.body.hiring).toBe(true)

  const response2 = await request
    .post(`/orgs/hiring`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)
  expect(response2.status).toBe(200)
  expect(response2.body.hiring).toBe(false)
}
