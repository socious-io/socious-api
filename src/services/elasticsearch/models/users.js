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
