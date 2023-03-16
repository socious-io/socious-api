import Payment from '../../../src/services/payments/index.js'
import Data from '@socious/data'
import { create as createTrx, complete as completeTrx } from '../../../src/services/payments/transaction.js'
import ImpactPoints from '../../../src/services/impact_points/index.js'

export const get = async (request, data) => {
  for (const project of data.projects.objs) {
    if (project.invalid) continue

    const response = await request.get(`/projects/${project.id}`).set('Authorization', data.users[0].access_token)

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      identity_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      search_tsv: expect.any(String),
      identity_meta: expect.any(Object),
      job_category_id: expect.any(String),
      job_category: expect.any(Object)
    })
  }
}

export const getAll = async (request, data) => {
  const response = await request.get('/projects?sort=-updated_at').set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)
  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        search_tsv: expect.any(String),
        identity_meta: expect.any(Object),
        job_category_id: expect.any(String),
        job_category: expect.any(Object)
      },
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        search_tsv: expect.any(String),
        identity_meta: expect.any(Object),
        job_category_id: expect.any(String),
        job_category: expect.any(Object)
      }
    ]
  })
}

export const getFiltered = async (request, data) => {
  const response = await request
    .get('/projects?filter.country=JP&filter.skills=ANDROID')
    .set('Authorization', data.users[0].access_token)

  expect(response.status).toBe(200)

  expect(response.body).toMatchSnapshot({
    items: [
      {
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        search_tsv: expect.any(String),
        identity_meta: expect.any(Object),
        job_category_id: expect.any(String),
        job_category: expect.any(Object)
      }
    ]
  })
}

export const getApplicant = async (request, data) => {
  for (const i in data.projects.objs) {
    if (data.projects.objs[i].invalid) continue

    for (const id of data.projects.objs[i].applications) {
      const response = await request.get(`/applicants/${id}`).set('Authorization', data.users[0].access_token)

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        project: expect.any(Object),
        project_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        user: expect.any(Object),
        user_id: expect.any(String),
        // TODO: need to verify answers
        answers: expect.any(Array)
      })
    }
  }
}

export const create = async (request, data) => {
  const categoriesRes = await request.get('/projects/categories')

  expect(categoriesRes.status).toBe(200)

  for (const i in data.projects.objs) {
    const body = data.projects.objs[i]
    delete body.invalid
    body.job_category_id = categoriesRes.body.categories.filter((c) => c.name === 'Other')[0].id

    const response = await request
      .post('/projects')
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)
      .send(body)

    if (data.users[i].invalid) {
      expect(response.status).toBe(400)
      expect(response.body).toMatchSnapshot()
    } else {
      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        identity_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        search_tsv: expect.any(String),
        job_category_id: expect.any(String)
      })
      data.projects.objs[i].id = response.body.id
    }
  }
}

export const addQuestion = async (request, data) => {
  for (const i in data.projects.objs) {
    for (const question of data.projects.questions) {
      const response = await request
        .post(`/projects/${data.projects.objs[i].id}/questions`)
        .set('Authorization', data.users[0].access_token)
        .set('Current-Identity', data.orgs[0].id)
        .send(question)

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        project_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
      if (!data.projects.objs[i].questions) {
        data.projects.objs[i].questions = []
      }
      data.projects.objs[i].questions.push(response.body.id)
    }
  }
}

export const removeQuestion = async (request, data) => {
  for (const i in data.projects.objs) {
    for (const question of data.projects.objs[i].questions) {
      const response = await request
        .post(`/projects/remove/${data.projects.objs[i].id}/questions/${question}`)
        .set('Authorization', data.users[0].access_token)
        .set('Current-Identity', data.orgs[0].id)
        .send(question)

      expect(response.status).toBe(200)
    }

    const response = await request
      .get(`/projects/${data.projects.objs[i].id}/questions`)
      .set('Authorization', data.users[0].access_token)

    expect(response.status).toBe(200)
    expect(response.body.questions).toHaveLength(0)
  }
}

export const apply = async (request, data) => {
  for (const i in data.projects.objs) {
    const body = data.projects.applications[i]
    delete body.invalid

    for (const j in body.answers) {
      body.answers[j] = {
        ...body.answers[j],
        id: data.projects.objs[i].questions[j]
      }
    }

    for (const user of data.users) {
      if (user.invalid) continue
      const response = await request
        .post(`/projects/${data.projects.objs[i].id}/applicants`)
        .set('Authorization', user.access_token)
        .send(body)

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        project: expect.any(Object),
        project_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        user: expect.any(Object),
        user_id: expect.any(String),
        // TODO: need to verify answers
        answers: expect.any(Array)
      })
      if (!data.projects.objs[i].applications) {
        data.projects.objs[i].applications = []
      }
      data.projects.objs[i].applications.push(response.body.id)
    }
  }
}

export const offer = async (request, data) => {
  for (const i in data.projects.objs) {
    const applicant = data.projects.applications[i]
    applicant.id = data.projects.objs[i].applications[0]

    if (applicant.payment_rate > 40000) continue

    const response = await request
      .post(`/applicants/${applicant.id}/offer`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)
      .send(data.projects.offers[0])

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      applicant: expect.any(Object),
      escrow: expect.any(Object),
      organization: expect.any(Object),
      job_category: expect.any(Object),
      applicant_id: expect.any(String),
      offerer: expect.any(Object),
      offerer_id: expect.any(String),
      recipient: expect.any(Object),
      recipient_id: expect.any(String),
      project: expect.any(Object),
      project_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      due_date: expect.any(String)
    })
  }
}

export const reject = async (request, data) => {
  for (const i in data.projects.objs) {
    const applicant = data.projects.applications[i]
    applicant.id = data.projects.objs[i].applications[0]

    if (applicant.payment_rate < 40000) continue

    const response = await request
      .post(`/applicants/${applicant.id}/reject`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)
      .send({
        feedback: 'TEST'
      })

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      project_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      user_id: expect.any(String)
    })
  }
}

export const approve = async (request, data) => {
  for (const user of data.users) {
    if (user.invalid) continue

    const offers = await request.get('/user/offers').set('Authorization', user.access_token)

    for (const offer of offers.body.items) {
      const response = await request.post(`/offers/${offer.id}/approve`).set('Authorization', user.access_token)

      if (offer.status === 'PENDING') {
        expect(response.status).toBe(200)
      } else {
        expect(response.status).toBe(400)
      }
    }
  }
}

export const hire = async (request, data) => {
  for (const i in data.projects.objs) {
    if (data.projects.objs[i].invalid) continue

    const offers = await request
      .get(`/projects/${data.projects.objs[i].id}/offers`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)

    const card = await request
      .post('/payments/cards')
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)
      .send({
        holder_name: 'test',
        numbers: '4242424242424242',
        exp_month: 11,
        exp_year: 2023,
        cvc: '314'
      })

    for (const offer of offers.body.items) {
      if (offer.status != 'APPROVED') continue

      // TODO: test with send and verify with STRIPE it self
      // Due Stripe sanctions and IR filtering for now we test on blow level of payments directly
      const payment = await createTrx({
        identity_id: data.orgs[0].id,
        amount: offer.assignment_total,
        currency: data.projects.objs[i].payment_currency,
        service: 'STRIPE',
        source: card.body.id,
        meta: {
          project_id: data.projects.objs[i].id
        }
      })

      await completeTrx(payment.id)

      await Payment.escrow({
        trx_id: payment.id,
        currency: data.projects.objs[i].payment_currency,
        project_id: offer.project_id,
        offer_id: offer.id,
        amount: offer.assignment_total
      })

      const response = await request
        .post(`/offers/${offer.id}/hire`)
        .set('Authorization', data.users[0].access_token)
        .set('Current-Identity', data.orgs[0].id)

      expect(response.status).toBe(200)
    }
  }
}

export const complete = async (request, data) => {
  const missions = await request.get('/user/missions').set('Authorization', data.users[0].access_token)

  for (const mission of missions.body.items) {
    const response = await request
      .post(`/missions/${mission.id}/complete`)
      .set('Authorization', data.users[0].access_token)

    expect(response.status).toBe(200)
  }
}

export const cancel = async (request, data) => {
  const missions = await request.get('/user/missions').set('Authorization', data.users[1].access_token)

  for (const mission of missions.body.items) {
    const response = await request
      .post(`/missions/${mission.id}/cancel`)
      .set('Authorization', data.users[1].access_token)

    expect(response.status).toBe(200)
  }
}

export const confirm = async (request, data) => {
  for (const project of data.projects.objs) {
    const missions = await request
      .get(`/projects/${project.id}/missions`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)

    for (const mission of missions.body.items) {
      if (mission.status != Data.MissionStatus.COMPLETE) continue

      const response = await request
        .post(`/missions/${mission.id}/confirm`)
        .set('Authorization', data.users[0].access_token)
        .set('Current-Identity', data.orgs[0].id)

      expect(response.status).toBe(200)

      await ImpactPoints.worker({ mission })

      const badgesRes = await request.get('/user/badges').set('Authorization', data.users[0].access_token)

      expect(badgesRes.body.badges).toMatchSnapshot()

      const impactRes = await request.get('/user/impact-points').set('Authorization', data.users[0].access_token)

      expect(impactRes.body.items).toHaveLength(1)

      const profileRes = await request.get('/user/profile').set('Authorization', data.users[0].access_token)

      expect(profileRes.body.impact_points).toBe(3564)
    }
  }
}

export const feedback = async (request, data) => {
  for (const project of data.projects.objs) {
    const missions = await request
      .get(`/projects/${project.id}/missions`)
      .set('Authorization', data.users[0].access_token)
      .set('Current-Identity', data.orgs[0].id)

    for (const mission of missions.body.items) {
      const response = await request
        .post(`/missions/${mission.id}/feedback`)
        .set('Authorization', data.users[0].access_token)
        .set('Current-Identity', data.orgs[0].id)
        .send({ content: 'TEST' })

      expect(response.status).toBe(200)
    }
  }
}

export const feedbacks = async (request, data) => {
  for (const project of data.projects.objs) {
    if (project.invalid) continue
    const response = await request
      .get(`/projects/${project.id}/feedbacks`)
      .set('Authorization', data.users[0].access_token)

    expect(response.status).toBe(200)
    if (response.body.items.length > 0) {
      expect(response.body.items[0]).toMatchSnapshot({
        id: expect.any(String),
        project_id: expect.any(String),
        mission_id: expect.any(String),
        created_at: expect.any(String),
        identity_id: expect.any(String),
        identity: expect.any(Object)
      })
    }
  }
}

export const userApplicants = async (request, data) => {
  for (const project of data.projects.objs) {
    if (project.invalid) continue
    const response = await request.get('/user/applicants').set('Authorization', data.users[0].access_token)

    expect(response.status).toBe(200)
    if (response.body.items.length > 0) {
      expect(response.body.items[0]).toMatchSnapshot({
        id: expect.any(String),
        project_id: expect.any(String),
        user_id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        organization: expect.any(Object),
        project: expect.any(Object),
        user: expect.any(Object)
      })
    }
  }
}
