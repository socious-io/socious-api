import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'jobs'
const indices = {
  index,
  fields: {
    title: { type: 'text' },
    description: { type: 'text' },
    other_party_title: { type: 'text' },
    other_party_url: { type: 'text' },
    project_type: { type: 'keyword' },
    payment_scheme: { type: 'keyword' },
    
    experience_level: { type: 'keyword' },
    payment_type: { type: 'keyword' },
    project_length: { type: 'keyword' },
    job_category_id: { type: 'keyword' },
    remote_preference: { type: 'keyword' },
    skills: { type: 'keyword' },
    country: { type: 'keyword' },
    city: { type: 'keyword' },
    causes_tags: { type: 'keyword' }
  }
}

const indexing = async ({id}) => {
  const project = await app.db.get(sql`SELECT * FROM projects WHERE id=${id}`)
  const document = {
    title: project.title,
    description: project.description,
    other_party_title: project.other_party_title,
    other_party_url: project.other_party_url,
    project_type: project.project_type,
    payment_scheme: project.payment_scheme,
    experience_level: project.experience_level,
    payment_type: project.payment_type,
    project_length: project.project_length,
    job_category_id: project.job_category_id,
    remote_preference: project.remote_preference,
    skills: project.skills,
    country: project.country,
    city: project.city,
    causes_tags: project.causes_tags
  }

  const indexingDocuments = [app.searchClient.indexDocument(index, project.id, document)]
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
