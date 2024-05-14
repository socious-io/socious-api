import supertest from 'supertest'
import { app } from '../../src/index.js'
import data from '../data/index.js'
import { registerAndVerify } from './globals/user.js'
import {
  comment,
  create,
  getAll,
  getFiltered,
  reactComment,
  reactPost,
  reply,
  unreactComment,
  unreactPost
} from './globals/post.js'

let server, request

beforeAll(async () => {
  server = app.listen()
  request = supertest(server)

  await registerAndVerify(request, data)
})

test('create posts', async () => create(request, data))
test('get posts', async () => getAll(request, data))
test('filter posts', async () => getFiltered(request, data))
test('comment posts', async () => comment(request, data))
test('reply comment posts', async () => reply(request, data))
test('react posts', async () => reactPost(request, data))
test('unreact posts', async () => unreactPost(request, data))
test('react comments', async () => reactComment(request, data))
test('unreact comments', async () => unreactComment(request, data))

const cleanup = async () => {
  await app.db.query('DELETE FROM users')
  await app.db.pool.end()
}

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done)
  })
})
