const index = 'organizations'
const indices = {
  index,
  fields: {
    name: { type: 'text' },
    bio: { type: 'text' },
    description: { type: 'text' },
    shortname: { type: 'text' },
    address: { type: 'text' },
    email: { type: 'text' },
    phone: { type: 'text' }
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
