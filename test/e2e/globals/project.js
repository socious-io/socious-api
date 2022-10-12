import {
  create as createTrx,
  complete as completeTrx,
} from '../../../src/services/payments/transaction.js';

export const create = async (request, data) => {
  for (const i in data.projects.objs) {
    const body = data.projects.objs[i];
    delete body.invalid;

    const response = await request
      .post('/projects')
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)
      .send(body);

    if (data.users[i].invalid) {
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        search_tsv: expect.any(String),
      });
      data.projects.objs[i].id = response.body.id;
    }
  }
};

export const addQuestion = async (request, data) => {
  for (const i in data.projects.objs) {
    for (const question of data.projects.questions) {
      const response = await request
        .post(`/projects/${data.projects.objs[i].id}/questions`)
        .set('Authorization', data.users[0].access_token)
        .set('Current-Identity', data.orgs[0].id)
        .send(question);

      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        project_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
      if (!data.projects.objs[i].questions)
        data.projects.objs[i].questions = [];
      data.projects.objs[i].questions.push(response.body.id);
    }
  }
};

export const apply = async (request, data) => {
  for (const i in data.projects.objs) {
    const body = data.projects.applications[i];
    delete body.invalid;

    for (const j in body.answers) {
      body.answers[j] = {
        ...body.answers[j],
        id: data.projects.objs[i].questions[j],
      };
    }

    const response = await request
      .post(`/projects/${data.projects.objs[i].id}/applicants`)
      .set('Authorization', data.users[i].access_token)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      project_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      user: expect.any(Object),
      user_id: expect.any(String),
      // TODO: need to verify answers
      answers: expect.any(Array),
    });
    if (!data.projects.objs[i].applications)
      data.projects.objs[i].applications = [];
    data.projects.objs[i].applications.push(response.body.id);
  }
};

export const offer = async (request, data) => {
  for (const i in data.projects.objs) {
    const applicant = data.projects.applications[i];
    applicant.id = data.projects.objs[i].applications[0];

    if (applicant.payment_rate > 40000) continue;

    const response = await request
      .post(`/applicants/${applicant.id}/offer`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)
      .send(data.projects.offers[0]);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      project_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      user_id: expect.any(String),
    });
  }
};

export const reject = async (request, data) => {
  for (const i in data.projects.objs) {
    const applicant = data.projects.applications[i];
    applicant.id = data.projects.objs[i].applications[0];

    if (applicant.payment_rate < 40000) continue;

    const response = await request
      .post(`/applicants/${applicant.id}/reject`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)
      .send({
        feedback: 'TEST',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      project_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      user_id: expect.any(String),
    });
  }
};

export const approve = async (request, data) => {
  for (const user of data.users) {
    if (user.invalid) continue;

    const applicants = await request
      .get('/user/applicants')
      .set('Authorization', user.access_token);

    for (const applicant of applicants.body.items) {
      const response = await request
        .post(`/applicants/${applicant.id}/approve`)
        .set('Authorization', user.access_token);

      if (applicant.status === 'OFFERED') {
        expect(response.status).toBe(200);
      } else {
        expect(response.status).toBe(400);
      }
    }
  }
};

export const hire = async (request, data) => {
  for (const i in data.projects.objs) {
    if (data.projects.objs[i].invalid) continue;

    const applicants = await request
      .get(`/projects/${data.projects.objs[i].id}/applicants`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id);

    for (const applicant of applicants.body.items) {
      if (applicant.status != 'APPROVED') continue;

      // TODO: test with send and verify with STRIPE it self
      // Due Stripe sanctions and IR filtering for now we test on blow level of payments directly
      const paymentId = await createTrx({
        identity_id: data.orgs[0].id,
        amount: applicant.assignment_total,
        currency: data.projects.objs[i].payment_currency,
        service: 'STRIPE',
        meta: {
          project_id: data.projects.objs[i].id,
        },
      });
      await completeTrx(paymentId);

      const response = await request
        .post(`/applicants/${applicant.id}/hire`)
        .set('Authorization', data.users[0].access_token)
        .set('Current-Identity', data.orgs[0].id);

      expect(response.status).toBe(200);
    }
  }
};
