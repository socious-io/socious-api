import supertest from 'supertest'
import { app } from '../../src/index.js'
import data from '../data/index.js'
import { registerAndVerify } from './globals/user.js'
import { create as createOrg } from './globals/org.js'
import {
  create,
  get,
  getAll,
  getFiltered,
  getApplicant,
  addQuestion,
  addMultipleQuestion,
  removeQuestion,
  apply,
  offer,
  reject,
  approve,
  hire,
  complete,
  cancel,
  confirm,
  feedback,
  feedbacks,
  userApplicants,
  markProjectAsSaved,
  fetchAllMarks,
  removeProjectMark,
  markSameProjectAsNotInterested,
  markOtherProjectAsNotInterested,
  searchApplicants
} from './globals/project.js'

let server, request

beforeAll(async () => {
  server = app.listen()
  request = supertest(server)

  await registerAndVerify(request, data)
  await createOrg(request, data)
})

test('create', async () => create(request, data))
test('get', async () => get(request, data))
test('get all', async () => getAll(request, data))
test('get filtered', async () => getFiltered(request, data))
test('add questions', async () => addQuestion(request, data))
test('add multiple questions', async () => addMultipleQuestion(request, data))
test('apply', async () => apply(request, data))
test('get applicants', async () => getApplicant(request, data))
test('offer', async () => offer(request, data))
test('reject', async () => reject(request, data))
test('approve', async () => approve(request, data))
test('hire', async () => hire(request, data))
test('complete', async () => complete(request, data))
test('cancel', async () => cancel(request, data))
test('confirm', async () => confirm(request, data))
test('send feedback', async () => feedback(request, data))
test('get feedbacks', async () => feedbacks(request, data))
test('user applicants', async () => userApplicants(request, data))
test('search applicants', async () => searchApplicants(request, data))
test('remove questions', async () => removeQuestion(request, data))

//Marking Projects
test('mark a project as SAVED', async () => markProjectAsSaved(request, data))
test('mark the same project as NOT_INTERESTED results in error', async () =>
  markSameProjectAsNotInterested(request, data))
test('mark other project as NOT_INTERESTED', async () => markOtherProjectAsNotInterested(request, data))
test('fetch all marks on projects', async () => fetchAllMarks(request, data))
test('remove a mark on project', async () => removeProjectMark(request, data))

const cleanup = async () => {
  await app.db.query('DELETE FROM users')
  await app.db.query('DELETE FROM organizations')
  await app.db.query('DELETE FROM projects')
  await app.db.pool.end()
}

afterAll((done) => {
  cleanup(done).then(() => {
    server.close(done)
  })
})
