import pg from 'pg';
import Config from '../src/config.js';

const client = new pg.Client({
  ...Config.database,
  database: 'postgres',
});

const main = async () => {
  await client.connect();
  await client.query(`CREATE DATABASE ${Config.database.db}`);
};

main().catch((ex) => {
  console.error(ex);
  process.exit(1);
});
