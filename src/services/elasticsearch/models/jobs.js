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

const indexing = async (client, document) => {
  const indexingDocuments = [client.indexDocument(index, document.id, document)]
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
