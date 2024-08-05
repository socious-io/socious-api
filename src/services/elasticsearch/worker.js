import client from './client.js'
import { users } from './models/index.js'

export const indexDocument = async ({ type, document }) => {
  const indexMapping = {
    user_update: users.indexing,
    user_create: users.indexing
  }

  if (indexMapping[type]) return await indexMapping[type](client, document)
}
