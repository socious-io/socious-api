import pg from 'pg';
import Config from '../src/config.js';

const client = new pg.Client({
  ...Config.database,
  database: 'postgres',
});

const main = async () => {
  if (Config.env !== 'testing') throw new Error('not valid env to dropdb');
  await client.connect();
  await client.query(`DROP DATABASE ${Config.database.db}`);
};

main().catch((ex) => {
  console.error(ex);
  process.exit(1);
});
