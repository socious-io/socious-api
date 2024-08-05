import sql from 'sql-template-tag'
import { app } from '../../../src/index.js'
import Org from '../../../src/models/organization'

export const register = async (request, data) => {
  for (const i in data.users) {
    const response = await request.post('/auth/register').send({
      username: data.users[i].username,
      first_name: data.users[i].first_name,
      last_name: data.users[i].last_name,
      email: data.users[i].email,
      password: data.users[i].password
    })

    if (data.users[i].invalid) {
      expect(response.status).toBe(400)
      expect(response.body).toMatchSnapshot()
    } else {
      expect(response.status).toBe(200)
    }
  }
}

export const verifyUser = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) continue

    const user = await app.db.get(sql`SELECT * FROM users WHERE email=${data.users[i].email}`)
    const otp = await app.db.get(sql`SELECT code FROM otps WHERE user_id=${user.id}`)

    const response = await request.get(`/auth/otp/confirm?code=${otp.code}&email=${user.email}`)
    expect(response.status).toBe(200)
    expect(response.body.access_token).not.toBeNull()
    expect(response.body.refresh_token).not.toBeNull()
    expect(response.body.token_type).toBe('Bearer')
    data.users[i].access_token = response.body.access_token
  }
}

export const registerAndVerify = async (request, data) => {
  await register(request, data)
  await verifyUser(request, data)
}

export const login = async (request, data) => {
  for (const i in data.users) {
    const response = await request.post('/auth/login').send({
      email: data.users[i].email,
      password: data.users[i].password
    })

    if (data.users[i].invalid) {
      expect(response.status).toBe(400)
      expect(response.body).toMatchSnapshot()
    } else {
      expect(response.status).toBe(200)
      expect(response.body.access_token).not.toBeNull()
      expect(response.body.refresh_token).not.toBeNull()
      expect(response.body.token_type).toBe('Bearer')

      data.users[i].access_token = response.body.access_token
    }
  }
}

export const loginEvent = async (request, data) => {
  const event = await app.db.get(`SELECT * FROM socious_events`)
  const response = await request.post(`/auth/login?event_id=${event.id}`).send({
    email: data.users[0].email,
    password: data.users[0].password
  })

  expect(response.status).toBe(200)
  expect(response.body.access_token).not.toBeNull()
  expect(response.body.refresh_token).not.toBeNull()
  expect(response.body.token_type).toBe('Bearer')

  data.users[0].access_token = response.body.access_token
}

export const profile = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request.get('/user/profile').set('Authorization', data.users[i].access_token)

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      languages: [
        {
          id: expect.any(String)
        }
      ],
      experiences: [
        {
          id: expect.any(String),
          job_category: expect.any(Object),
          org: expect.any(Object),
          credential: expect.any(Object)
        }
      ],
      events: expect.any(Object),
      educations: [
        {
          id: expect.any(String),
          org: expect.any(Object),
          credential: expect.any(Object)
        }
      ]
    })
  }
}

export const updateProfile = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }

    const body = JSON.parse(JSON.stringify(data.users[i]))
    delete body.email
    delete body.password
    delete body.invalid
    delete body.language
    delete body.experience
    delete body.id
    delete body.access_token
    delete body.education

    const response = await request
      .post('/user/update/profile')
      .set('Authorization', data.users[i].access_token)
      .send(body)

    if (i == 1) {
      expect(response.status).toBe(400)
      expect(response.body).toMatchSnapshot()
      continue
    }
    expect(response.status).toBe(200)

    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      languages: [
        {
          id: expect.any(String)
        }
      ],
      experiences: [
        {
          id: expect.any(String),
          job_category: expect.any(Object),
          org: expect.any(Object),
          credential: expect.any(Object)
        }
      ],
      events: expect.any(Object),
      educations: [
        {
          id: expect.any(String),
          org: expect.any(Object),
          credential: expect.any(Object)
        }
      ]
    })
  }
}

export const addLanguage = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request.post('/user/languages').set('Authorization', data.users[i].access_token).send({
      name: 'FA',
      level: 'NATIVE'
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String)
    })

    data.users[i].language = response.body.id
  }
}

export const updateLanguage = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request
      .post(`/user/languages/update/${data.users[i].language}`)
      .set('Authorization', data.users[i].access_token)
      .send({
        name: 'EN',
        level: 'PROFICIENT'
      })

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String)
    })
  }
}

export const addExperience = async (request, data) => {
  for (const i in data.orgs) {
    const body = data.orgs[i]

    if (body.invalid) continue

    delete body.invalid

    const response = await request.post('/orgs').set('Authorization', data.users[0].access_token).send(body)

    expect(response.status).toBe(200)
    data.orgs[i].id = response.body.id
  }

  const categoriesRes = await request.get('/projects/categories')

  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request
      .post('/user/experiences')
      .set('Authorization', data.users[i].access_token)
      .send({
        org_id: data.orgs[0].id,
        title: 'Test',
        description: 'Test',
        start_at: '2022-10-16T13:32:30.211Z',
        country: 'IR',
        city: 'Tehran',
        employment_type: 'FULL_TIME',
        total_hours: 24,
        job_category_id: categoriesRes.body.categories.filter((c) => c.name === 'Other')[0].id
      })

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String),
      org_id: expect.any(String),
      start_at: expect.any(String),
      job_category_id: expect.any(String)
    })

    data.users[i].experience = response.body.id
  }
}

export const updateExperience = async (request, data) => {
  const categoriesRes = await request.get('/projects/categories')
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request
      .post(`/user/experiences/update/${data.users[i].experience}`)
      .set('Authorization', data.users[i].access_token)
      .send({
        org_id: data.orgs[0].id,
        title: 'Test',
        description: 'Test',
        start_at: '2022-10-16T13:32:30.211Z',
        country: 'IR',
        city: 'Tehran',
        total_hours: 22,
        employment_type: 'FULL_TIME',
        job_category_id: categoriesRes.body.categories.filter((c) => c.name === 'Other')[0].id
      })

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String),
      org_id: expect.any(String),
      start_at: expect.any(String),
      job_category_id: expect.any(String)
    })
  }
}

export const addEducation = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request.post('/user/educations').set('Authorization', data.users[i].access_token).send({
      org_id: data.orgs[0].id,
      title: 'Test',
      description: 'Test',
      start_at: '2022-10-16T13:32:30.211Z',
      end_at: '2022-11-16T13:32:30.211Z'
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String),
      org_id: expect.any(String),
      start_at: expect.any(String),
      end_at: expect.any(String)
    })

    data.users[i].education = response.body.id
  }
}

export const updateEducation = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request
      .post(`/user/educations/update/${data.users[i].education}`)
      .set('Authorization', data.users[i].access_token)
      .send({
        org_id: data.orgs[0].id,
        title: 'Test 2',
        description: 'Test',
        start_at: '2022-10-16T13:32:30.211Z',
        end_at: '2022-11-16T13:32:30.211Z'
      })
    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      user_id: expect.any(String),
      org_id: expect.any(String),
      start_at: expect.any(String),
      end_at: expect.any(String)
    })
  }
}

export const requestExperienceCredentials = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }

    const response = await request
      .post(`/credentials/experiences/${data.users[i].experience}`)
      .set('Authorization', data.users[i].access_token)
      .send({
        message: 'approve please'
      })

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      user_id: expect.any(String),
      org_id: expect.any(String),
      experience_id: expect.any(String)
    })
  }
}

export const approveRequestedExperienceCredentials = async (request, data) => {
  const response = await request
    .get(`/credentials/experiences/`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)

  expect(response.status).toBe(200)
  expect(response.body.items.length).toBe(2)

  await Org.updateDID(data.orgs[0].id, 'testDID')

  const approveRes = await request
    .post(`/credentials/experiences/${response.body.items[0].id}/approve`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)

  expect(approveRes.status).toBe(200)
}

export const requestEducationCredentials = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }

    const response = await request
      .post(`/credentials/educations/${data.users[i].education}`)
      .set('Authorization', data.users[i].access_token)
      .send({
        message: 'approve please'
      })
    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      user_id: expect.any(String),
      org_id: expect.any(String),
      education_id: expect.any(String)
    })
  }
}

export const approveRequestedEducationCredentials = async (request, data) => {
  const response = await request
    .get(`/credentials/educations/`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)

  expect(response.status).toBe(200)
  expect(response.body.items.length).toBe(2)

  await Org.updateDID(data.orgs[0].id, 'testDID')

  const approveRes = await request
    .post(`/credentials/educations/${response.body.items[0].id}/approve`)
    .set('Authorization', data.users[0].access_token)
    .set('Current-Identity', data.orgs[0].id)

  expect(approveRes.status).toBe(200)
}

export const profileByUsername = async (request, data) => {
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request
      .get(`/user/by-username/${data.users[i].username}/profile`)
      .set('Authorization', data.users[i].access_token)

    expect(response.status).toBe(200)
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      languages: [
        {
          id: expect.any(String)
        }
      ],
      events: expect.any(Object),
      experiences: [
        {
          id: expect.any(String),
          start_at: expect.any(String),
          job_category: expect.any(Object),
          org: expect.any(Object),
          credential: expect.any(Object)
        }
      ],
      educations: [
        {
          id: expect.any(String),
          start_at: expect.any(String),
          org: expect.any(Object),
          credential: expect.any(Object)
        }
      ]
    })
  }
}

export const updateUserWallet = async (request, data) => {
  const wallet = '0x18Adf002AE3a67089E67B5765DaB67Be01C7b5ee'
  for (const i in data.users) {
    if (data.users[i].invalid) {
      continue
    }
    const response = await request.post(`/user/update/wallet`).set('Authorization', data.users[i].access_token).send({
      wallet_address: wallet
    })

    expect(response.status).toBe(200)
    expect(response.body.wallet_address).toBe(wallet)
  }
}

export const openToWork = async (request, data) => {
  const response = await request.post(`/user/open-to-work`).set('Authorization', data.users[0].access_token)
  expect(response.status).toBe(200)
  expect(response.body.open_to_work).toBe(true)
  const response2 = await request.post(`/user/open-to-work`).set('Authorization', data.users[0].access_token)
  expect(response2.status).toBe(200)
  expect(response2.body.open_to_work).toBe(false)
}

export const openToVolunteer = async (request, data) => {
  const response = await request.post(`/user/open-to-volunteer`).set('Authorization', data.users[0].access_token)
  expect(response.status).toBe(200)
  expect(response.body.open_to_volunteer).toBe(true)
  const response2 = await request.post(`/user/open-to-volunteer`).set('Authorization', data.users[0].access_token)
  expect(response2.status).toBe(200)
  expect(response2.body.open_to_volunteer).toBe(false)
}

export const registerReferredBy = async (request, data) => {
  const referrerProfileNotVerified = await request.get('/user/profile').set('Authorization', data.users[0].access_token)
  expect(referrerProfileNotVerified.status).toBe(200)

  const response = await request.post(`/auth/register?referred_by=${referrerProfileNotVerified.body.id}`).send({
    username: 'test_username_referred',
    first_name: data.users[0].first_name,
    last_name: data.users[0].last_name,
    email: 'test_referred@referred.com',
    password: data.users[0].password
  })
  expect(response.status).toBe(400)
}
