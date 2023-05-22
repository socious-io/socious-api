import supertest from 'supertest'
import { app } from '../../src/index.js'

let server, request

beforeAll(() => {
  server = app.listen()
  request = supertest(server)
})

test('ping works', async () => {
  const response = await request.get('/ping')
  expect(response.status).toBe(200)
  expect(response.text).toMatchSnapshot()
})

afterAll((done) => {
  server.close(done)
})
