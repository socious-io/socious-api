import pg from 'pg'
import Config from '../src/config.js'
import { readFileSync } from 'fs'


async function main() {  
  // Create a new client for connecting to the 'postgres' database
  const client = new pg.Client({
    ...Config.database,
    database: 'postgres'
  });
  
  const schema = readFileSync('src/sql/schema.sql');
  try {
    await client.connect();    

    // Create the new database if it doesn't exist
    await client.query(`CREATE DATABASE ${Config.database.db}`);
    
    // Disconnect from the current connection
    await client.end();

    // Create a new client for connecting to the new database
    const newClient = new pg.Client(Config.database);
    await newClient.connect();

    // Run the schema SQL
    await newClient.query(schema.toString());    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().then(() => process.exit(0))
