import client from './client.js'
import models from './models/index.js'

export const indexDocument = async ({ type, document }) => {
  const indexMapping = {
    user_update: models.users.indexing,
    user_create: models.users.indexing,
    job_update: models.jobs.indexing,
    job_create: models.jobs.indexing,
    organization_update: models.organizations.indexing,
    organization_create: models.organizations.indexing
  }

  if (indexMapping[type]) return await indexMapping[type](client, document)
}
