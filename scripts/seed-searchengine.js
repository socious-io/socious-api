import {} from '../src/index.js'
import SearchEngine from '../src/services/elasticsearch/index.js'

async function run() {
  console.log('Indexing All Users ...')
  const userResult = await SearchEngine.models.users.initIndexing()
  console.log(`Indexed ${userResult.count} Users`)

  console.log('Indexing All Organizations ...')
  const orgResult = await SearchEngine.models.organizations.initIndexing()
  console.log(`Indexed ${orgResult.count} Organizations`)

  console.log('Indexing All Projects ...')
  const projectResult = await SearchEngine.models.projects.initIndexing()
  console.log(`Indexed ${projectResult.count} Projects`)

  console.log('Indexing All Locations ...')
  const locationResult = await SearchEngine.models.locations.initIndexing()
  console.log(`Indexed ${locationResult.count} Locations`)
}

run().then(() => process.exit(0))
