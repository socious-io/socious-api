import { app } from '../../index.js'
import publish from '../jobs/publish.js'

export const indexUsers = ({ id }) => {
  publish('index_users', { id })
}

export const indexProjects = ({ id }) => {
  publish('index_projects', { id })
}

export const indexOrganizations = ({ id }) => {
  publish('index_organizations', { id })
}

export const indexLocations = ({ id }) => {
  publish('index_locations', { id })
}

export const startSync = async () => {
  const tableToIndexFunc = {
    projects: indexProjects,
    users: indexUsers,
    organizations: indexOrganizations,
    geonames: indexLocations,
    countries: indexLocations
  }

  app.db.on('elastic_update', async (msg) => {
    const { operation, table, data } = JSON.parse(msg.payload)
    const indexFunc = tableToIndexFunc[table]

    if (!indexFunc) {
      console.error(`No indexing function found for table ${table} on elastic`)
    }

    if (operation === 'INSERT' || operation === 'UPDATE' || operation === 'DELETE') {
      await indexFunc(data)
    }
  })
}
