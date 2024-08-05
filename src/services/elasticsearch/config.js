import client from './client.js'
import models from './models/index.js'

const indices = [models.users.indices, models.organizations.indices, models.jobs.indices]

async function ensureIndexes() {
  const indicesConfigs = []

  for (const indice of indices) {
    const exists = await client.existsIndex(indice.index)
    if (!exists) indicesConfigs.push(client.createIndices(indice.index, indice.fields))
  }

  await Promise.allSettled(indicesConfigs)
}

async function configure() {
  await ensureIndexes()
}

export default configure
