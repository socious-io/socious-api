import models from './models/index.js'
import { app } from '../../index.js'

export const startSync = async () => {
  const tableToIndexFunc = {
    projects: models.jobs.indexing,
    users: models.users.indexing,
    organizations: models.organizations.indexing
  }

  app.db.on('elastic_update', async (msg) => {
    const { operation, table, data } = JSON.parse(msg.payload)
    const indexFunc = tableToIndexFunc[table]

    console.log(indexFunc, operation, table, data)

    if (!indexFunc) {
      console.error(`No indexing function found for table ${table} on elastic`)
    }

    if (operation === 'INSERT' || operation === 'UPDATE') {
      await indexFunc(data)
    }
    //TODO: implement delete operation
    // else if (payload.operation === 'DELETE') {
    //   await deleteFromElasticsearch(payload.data.id)
    // }
  })
}
