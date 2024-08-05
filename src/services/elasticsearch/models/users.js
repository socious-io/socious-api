const indices = {
  index: 'users',
  fields: {
    first_name: { type: 'text' },
    last_name: { type: 'text' },
    username: { type: 'keyword' },
    email: { type: 'keyword' },
    created_at: { type: 'date' }
  }
}

const indexing = async (client, document) => {
  const indexingDocuments = [client.indexDocument('users', document.id, document)]
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
