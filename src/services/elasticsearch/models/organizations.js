import { app } from '../../../index.js'
import sql from 'sql-template-tag'

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
    phone: { type: 'text' },

    country: { type: 'keyword' },
    city: { type: 'keyword' },
    social_causes: { type: 'keyword' }
  }
}

const indexing = async ({id}) => {
  const organization = await app.db.get(sql`SELECT * FROM organizations WHERE id=${id}`)
  const document = {
    name: organization.name,
    bio: organization.bio,
    description: organization.description,
    shortname: organization.shortname,
    address: organization.address,
    email: organization.email,
    phone: organization.phone,
    country: organization.country,
    city: organization.city,
    social_causes: organization.social_causes
  }

  const indexingDocuments = [app.searchClient.indexDocument(index, organization.id, document)]
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
