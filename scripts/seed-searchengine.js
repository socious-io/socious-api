import {} from '../src/index.js'
import SearchEngine from '../src/services/elasticsearch/index.js'

async function run() {
  console.log('Indexing All Users ...')
  const userResult = await SearchEngine.models.users.initIndexing()
  console.log(`Indexed ${userResult.count} Users`)

  console.log('Indexing All Organizations ...')
  const orgResult = await SearchEngine.models.organizations.initIndexing()
  console.log(`Indexed ${orgResult.count} Organizations`)

  console.log('Indexing All Jobs ...')
  const jobResult = await SearchEngine.models.jobs.initIndexing()
  console.log(`Indexed ${jobResult.count} Jobs`)
}

run().then(() => process.exit(0))
