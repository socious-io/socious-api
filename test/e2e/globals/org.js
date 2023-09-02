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
