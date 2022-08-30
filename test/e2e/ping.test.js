import request from 'supertest';
import {app} from '../../src/index.js';


test('ping works', async () => {
    const response = await request(app.callback()).get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toMatchSnapshot();
    return true;
});
