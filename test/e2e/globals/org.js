export const create = async (request, data) => {
  for (const i in data.orgs) {
    const body = data.orgs[i];
    delete body.invalid;

    const response = await request
      .post('/orgs')
      .set('Authorization', data.users[0].access_token)
      .send(body);

    if (data.users[i].invalid) {
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: expect.any(String),
        shortname: expect.any(String),
        search_tsv: expect.any(String),
      });

      data.orgs[i].id = response.body.id;
    }
  }
};
