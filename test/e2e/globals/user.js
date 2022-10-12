export const register = async (request, data) => {
  for (const i in data.users) {
    const response = await request.post('/auth/register').send({
      username: data.users[i].username,
      first_name: data.users[i].first_name,
      last_name: data.users[i].last_name,
      email: data.users[i].email,
      password: data.users[i].password,
    });

    if (data.users[i].invalid) {
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
    } else {
      expect(response.status).toBe(200);
      expect(response.body.access_token).not.toBeNull();
      expect(response.body.refresh_token).not.toBeNull();
      expect(response.body.token_type).toBe('Bearer');

      data.users[i].access_token = response.body.access_token;
    }
  }
};

export const login = async (request, data) => {
  for (const i in data.users) {
    const response = await request.post('/auth/login').send({
      email: data.users[i].email,
      password: data.users[i].password,
    });

    if (data.users[i].invalid) {
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
    } else {
      expect(response.status).toBe(200);
      expect(response.body.access_token).not.toBeNull();
      expect(response.body.refresh_token).not.toBeNull();
      expect(response.body.token_type).toBe('Bearer');

      data.users[i].access_token = response.body.access_token;
    }
  }
};

export const profile = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue;
    }
    const response = await request
      .get('/user/profile')
      .set('Authorization', data.users[i].access_token);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      search_tsv: expect.any(String),
    });
  }
};
