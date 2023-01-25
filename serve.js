import Config from './src/config.js'
import { app } from './src/index.js'
import Debug from 'debug'
import fs from 'fs/promises'
const debug = Debug('tolling:server')

fs.readFile('/var/lib/share/test.txt').then((r) => {
  console.log('------------------------')
  console.log(r.toString())
  console.log('------------------------')
})

app.listen(Config.port, () => {
  debug(`API server started on :${Config.port}`)
  console.log(`API server started on :${Config.port}`)
})
