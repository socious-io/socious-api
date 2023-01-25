import pg from 'pg'
import Config from '../src/config.js'

const client = new pg.Client({
  ...Config.database,
  database: 'postgres'
})

try {
  await client.connect()

  await client.query(`CREATE DATABASE ${Config.database.db}`)
} catch (e) {
  console.log(e)
  process.exit(1)
}
process.exit(0)
