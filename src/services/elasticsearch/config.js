import client from './client.js'
import { users } from './models/index.js'

const indices = [users.indices]

async function ensureIndexes() {
  const indicesConfigs = []

  for (const indice of indices) {
    const exists = await client.existsIndex(indice.index)
    if (!exists) indicesConfigs.push(client.createIndices(indice.index, indice.fields))
  }

  const results = await Promise.allSettled(indicesConfigs)
}

async function configure() {
  await ensureIndexes()
}

export default configure
