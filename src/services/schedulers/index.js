import ElasticSearchScheduler from './elasticsearch.js'

const register = {
  elasticsearch: ElasticSearchScheduler
}

for (const scheduler of Object.values(register)) {
  scheduler.start()
}
