import fs from 'fs/promises'
import publish from '../src/services/jobs/publish.js'

const main = async () => {
  const name = process.argv[2]
  const dataFile = process.argv[3]

  const file = await fs.readFile(dataFile)

  publish(name, file.toJSON())

  return 'complete'
}

main()
  .then((r) => {
    console.log(r)
  })
  .catch((e) => {
    console.log(e)
  })

process.exit(0)
