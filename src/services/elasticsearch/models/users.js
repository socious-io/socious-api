import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'users'
const indices = {
  index,
  fields: {
    first_name: { type: 'text' },
    last_name: { type: 'text' },
    username: { type: 'keyword' },
    email: { type: 'keyword' },
    created_at: { type: 'date' },

    experience_level: { type: 'keyword' },
    project_length: { type: 'keyword' },
    job_category_id: { type: 'keyword' },
    remote_preference: { type: 'keyword' },
    skills: { type: 'keyword' },
    country: { type: 'keyword' },
    city: { type: 'keyword' },
    payment_type: { type: 'keyword' },
    causes_tags: { type: 'keyword' }
  }
}

const indexing = async ({id}) => {

  const user = await app.db.get(sql`SELECT * FROM users WHERE id=${id}`)
  const document = {
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    created_at: user.created_at,

    experience_level: user.experience_level,
    project_length: user.project_length,
    job_category_id: user.job_category_id,
    remote_preference: user.remote_preference,
    skills: user.skills,
    country: user.country,
    city: user.city,
    payment_type: user.payment_type,
    causes_tags: user.causes_tags
  }

  console.log(user, document)

  const indexingDocuments = [app.searchClient.indexDocument(index,user.id, document)]
  try {
    return await Promise.all(indexingDocuments)
  } catch (e) {
    console.log(e)
  }
}

export default {
  indices,
  indexing
}
