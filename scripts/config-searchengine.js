import {} from '../src/index.js'
import SearchEngine from '../src/services/elasticsearch/index.js'

async function run() {
  console.log('Configuring Elastic Search ...')
  await SearchEngine.config()
  console.log(`Configuring Completed`)
}

run().then(() => process.exit(0))
