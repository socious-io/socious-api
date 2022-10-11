import supertest from 'supertest';
import {app} from '../../src/index.js';
import Data from '../data/index.js';

import {register} from './user.test.js'

let server, request;

beforeAll(async () => {
  server = app.listen();
  request = supertest(server);

  await register()
});

test('create', async () => {
  for (const i in Data.orgs) {
    const response = await request.post('/orgs')
    .set('Authorization', Data.users[0].access_token)
    .send({
      name: Data.orgs[i].name,
      bio: Data.orgs[i].bio,
      description: Data.orgs[i].description,
      email: Data.orgs[i].email,
      phone: Data.orgs[i].phone,
      type: Data.orgs[i].type,
      city: Data.orgs[i].city,
      address: Data.orgs[i].address,
      country: Data.orgs[i].country,
      social_causes: Data.orgs[i].social_causes,
      website:  Data.orgs[i].website,
      mobile_country_code: Data.orgs[i].mobile_country_code,
      image: Data.orgs[i].image,
      cover_image: Data.orgs[i].cover_image,
      mission: Data.orgs[i].mission,
      culture: Data.orgs[i].culture,
    })

    if (Data.users[i].invalid) {
      expect(response.status).toBe(400);
    } else {
      expect(response.status).toBe(200);
    }
    expect(response.body).toMatchSnapshot();
  }
})

afterAll((done) => {
  app.db.pool.end().then(() => {
    server.close(done);
  });
});
