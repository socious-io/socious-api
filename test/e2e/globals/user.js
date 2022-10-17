import {app} from '../../../src/index.js';

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
  await app.db.query(`UPDATE users SET status='ACTIVE'`);
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
      languages: [
        {
          id: expect.any(String),
        },
      ],
      experiences: [
        {
          id: expect.any(String),
          org: {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: expect.any(String),
            shortname: expect.any(String),
            search_tsv: expect.any(String),
          },
        },
      ],
    });
  }
};

export const addLanguage = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue;
    }
    const response = await request
      .post('/user/languages')
      .set('Authorization', data.users[i].access_token)
      .send({
        name: 'FA',
        level: 'NATIVE',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String),
    });

    data.users[i].language = response.body.id;
  }
};

export const updateLanguage = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue;
    }
    const response = await request
      .post(`/user/languages/update/${data.users[i].language}`)
      .set('Authorization', data.users[i].access_token)
      .send({
        name: 'EN',
        level: 'PROFICIENT',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String),
    });
  }
};

export const addExperience = async (request, data) => {
  for (const i in data.orgs) {
    const body = data.orgs[i];

    if (body.invalid) continue;

    delete body.invalid;

    const response = await request
      .post('/orgs')
      .set('Authorization', data.users[0].access_token)
      .send(body);

    expect(response.status).toBe(200);
    data.orgs[i].id = response.body.id;
  }

  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue;
    }
    const response = await request
      .post('/user/experiences')
      .set('Authorization', data.users[i].access_token)
      .send({
        org_id: data.orgs[0].id,
        title: 'Test',
        description: 'Test',
        start_at: '2022-10-16T13:32:30.211Z',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String),
      org_id: expect.any(String),
      start_at: expect.any(String),
    });

    data.users[i].experience = response.body.id;
  }
};

export const updateExperience = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue;
    }
    const response = await request
      .post(`/user/experiences/update/${data.users[i].experience}`)
      .set('Authorization', data.users[i].access_token)
      .send({
        org_id: data.orgs[0].id,
        title: 'Test',
        description: 'Test',
        start_at: '2022-10-16T13:32:30.211Z',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String),
      org_id: expect.any(String),
      start_at: expect.any(String),
    });
  }
};

export const profileByUsername = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue;
    }
    const response = await request
      .get(`/user/by-username/${data.users[i].username}/profile`)
      .set('Authorization', data.users[i].access_token);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      languages: [
        {
          id: expect.any(String),
        },
      ],
      experiences: [
        {
          id: expect.any(String),
          start_at: expect.any(String),
          org: {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: expect.any(String),
            shortname: expect.any(String),
            search_tsv: expect.any(String),
          },
        },
      ],
    });
  }
};
