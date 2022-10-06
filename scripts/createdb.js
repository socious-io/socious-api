import pg from 'pg';
import Config from '../src/config.js';

const client = new pg.Client({
  ...Config.database,
  database: 'postgres',
});

await client.connect();

await client.query(`CREATE DATABASE ${Config.database.db}`);
