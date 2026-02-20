import ElasticSearchScheduler from './elasticsearch.js'
import JobScrapersScheduler from './job-scrapers.js'

const register = {
  elasticsearch: ElasticSearchScheduler,
  jobScrapers: JobScrapersScheduler
}

for (const scheduler of Object.values(register)) {
  scheduler.start()
}
