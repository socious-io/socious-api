import client from './client.js'
import models from './models/index.js'

const indices = [models.users.indices, models.organizations.indices, models.jobs.indices, models.locations.indices]

async function ensureIndexes() {
  const indicesConfigs = []

  for (const indice of indices) {
    // const exists = await client.existsIndex(indice.index)
    // console.log(indice.index, exists)
    // if (!exists)
    // else indicesConfigs.push(client.updateIndexMapping(indice.index, indice.fields))
    indicesConfigs.push(client.createIndices(indice.index, indice.fields, indice.settings))
  }

  const results = await Promise.allSettled(indicesConfigs)
  results.forEach(result=>{
    // @ts-ignore
    const { status, reason, value} = result;
    if(status=="fulfilled"){
      console.log(value)
    }else {
      console.error(reason)
    }
  })
}

async function configure() {
  await ensureIndexes()
}

export default configure
