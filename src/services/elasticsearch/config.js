import client from './client.js'

const indexes = [
  "users"
]

async function ensureIndexes(){
  const indexConfigs = indexes.map(index=>client.createIndex(index))
  const results = await Promise.allSettled(indexConfigs)
  console.log(results)
}

async function configure(){
  await ensureIndexes();
}

export default configure
