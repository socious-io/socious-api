import pg from 'pg';
import Config from '../src/config.js';

const client = new pg.Client({
  ...Config.database,
  database: 'postgres',
});

if (Config.env !== 'testing') throw new Error('not valid env to dropdb');

try {
  await client.connect();

  await client.query(`DROP DATABASE ${Config.database.db}`);
} catch (e) {
  console.log(e);
  process.exit(1);
}
process.exit(0);
