import sql from 'sql-template-tag';
import Data from '../../data/index.js';
import {app} from '../../src/index.js';

export const register = async (request) => {
  for (const i in Data.users) {
    
    const response = await request.post('/auth/register').send({
      username: Data.users[i].username,
      first_name: Data.users[i].first_name,
      last_name: Data.users[i].last_name,
      email: Data.users[i].email,
      password: Data.users[i].password,
    });

    // make user same as snapped
    await app.db.query(sql`DELETE FROM otps`);
    await app.db.query(sql`
    UPDATE users 
      SET id=${Data.users[i].id},
      created_at=${Data.users[i].created_at},
      updated_at=${Data.users[i].updated_at} 
    WHERE email=${Data.users[i].email}`);

    if (Data.users[i].invalid) {
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
    } else {
      expect(response.status).toBe(200);
      expect(response.body.access_token).not.toBeNull();
      expect(response.body.refresh_token).not.toBeNull();
      expect(response.body.token_type).toBe('Bearer');
    }
  }
}

export const login = async (request) => {
  for (const i in Data.users) {
    const response = await request.post('/auth/login').send({
      email: Data.users[i].email,
      password: Data.users[i].password,
    });
    Data.users[i].access_token = response.body.access_token;

    if (Data.users[i].invalid) {
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
    } else {
      expect(response.status).toBe(200);
      expect(response.body.access_token).not.toBeNull();
      expect(response.body.refresh_token).not.toBeNull();
      expect(response.body.token_type).toBe('Bearer');
    }
  }
}

export const profile = async (request) => {
  for (const i in Data.users) {
    if (Data.users[i].invalid) {
      continue;
    }
    const response = await request
      .get('/user/profile')
      .set('Authorization', Data.users[i].access_token);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  }
}
