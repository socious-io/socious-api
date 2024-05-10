export const create = async (request, data) => {
  for (const i in data.posts) {
    const response = await request.post('/posts').set('Authorization', data.users[0].access_token).send(data.posts[i])

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      identity_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      identity_meta: expect.any(Object)
    })

    data.posts[i].id = response.body.id
  }
}

export const getAll = async (request, data) => {
  const response = await request.get('/posts').set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        identity_meta: expect.any(Object)
      },
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        identity_meta: expect.any(Object)
      }
    ]
  })
}

export const comment = async (request, data) => {
  for (const i in data.posts) {
    const response = await request.post(`/posts/${data.posts[i].id}/comments`)
      .set('Authorization', data.users[0].access_token)
      .send({content: 'test comment'})

    expect(response.status).toBe(200)
    data.posts[i].comment_id = response.body.id
  }
}

export const reply = async (request, data) => {
  for (const i in data.posts) {
    const response = await request.post(`/posts/${data.posts[i].id}/comments`)
      .set('Authorization', data.users[0].access_token)
      .send({content: 'test comment reply', reply_id: data.posts[i].comment_id})

    expect(response.status).toBe(200)
  }
}

export const reactPost = async (request, data) => {
  for (const i in data.posts) {
    const response = await request.post(`/posts/${data.posts[i].id}/react`)
      .set('Authorization', data.users[0].access_token)
      .send({emoji: ':D'})

    expect(response.status).toBe(200)
  }
}

export const unreactPost = async (request, data) => {
  for (const i in data.posts) {
    const response = await request.post(`/posts/${data.posts[i].id}/unreact`)
      .set('Authorization', data.users[0].access_token)
      .send({emoji: ':D'})

    expect(response.status).toBe(200)
  }
}

export const reactComment = async (request, data) => {
  for (const i in data.posts) {
    const response = await request.post(`/posts/${data.posts[i].id}/comments/${data.posts[i].comment_id}/react`)
      .set('Authorization', data.users[0].access_token)
      .send({emoji: ':D'})

    expect(response.status).toBe(200)
  }
}

export const unreactComment = async (request, data) => {
  for (const i in data.posts) {
    const response = await request.post(`/posts/${data.posts[i].id}/comments/${data.posts[i].comment_id}/unreact`)
      .set('Authorization', data.users[0].access_token)
      .send({emoji: ':D'})

    expect(response.status).toBe(200)
  }
}

export const repost = async (request, data) => {
  const response = await request.get('/posts').set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  for (const post of response.body.items) {
    const reportResponse = await request
      .post(`/posts/${post.id}/report`)
      .send({
        comment: 'test'
      })
      .set('Authorization', data.users[0].access_token)

    expect(reportResponse.status).toBe(200)
    expect(reportResponse.body).toMatchSnapshot()
  }
}

export const getFiltered = async (request, data) => {
  const response = await request
    .get('/posts?filter.hashtags=TEST&filter.causes_tags=SOCIAL,HEALTH')
    .set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        identity_meta: expect.any(Object)
      }
    ]
  })
}
