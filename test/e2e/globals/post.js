export const create = async (request, data) => {
  for (const i in data.posts) {
    const response = await request
      .post(`/posts`)
      .set('Authorization', data.users[0].access_token)
      .send(data.posts[i]);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      identity_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      identity_meta: expect.any(Object),
    });
  }
};

export const getAll = async (request, data) => {
  const response = await request
    .get(`/posts`)
    .set('Authorization', data.users[0].access_token);

  expect(response.status).toBe(200);
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        identity_meta: expect.any(Object),
      },
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        identity_meta: expect.any(Object),
      },
    ],
  });
};

export const getFiltered = async (request, data) => {
  const response = await request
    .get(`/posts?filter.hashtags=TEST&filter.causes_tags=SOCIAL,HEALTH`)
    .set('Authorization', data.users[0].access_token);

  expect(response.status).toBe(200);
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        identity_meta: expect.any(Object),
      },
    ],
  });
};
