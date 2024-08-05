import client from './client.js'
import models from './models/index.js'

export const indexDocument = async ({ type, document }) => {
  const indexMapping = {
    users: models.users.indexing,
    jobs: models.jobs.indexing,
    organizations: models.organizations.indexing
  }

  if (indexMapping[type]) return await indexMapping[type](client, document)
}
