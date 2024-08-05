const index = 'jobs'
const indices = {
  index,
  fields: {
    title: { type: 'text' },
    description: { type: 'text' },
    other_party_title: { type: 'text' },
    other_party_url: { type: 'text' },
    skills: { type: 'text' },
    country: { type: 'text' },
    city: { type: 'text' },
    payment_type: { type: 'text' },
    causes_tags: { type: 'text' },
    remote_preference: { type: 'text' }
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
