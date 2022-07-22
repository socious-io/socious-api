import sql from 'sql-template-tag';
import {app} from '../../index.js';


export default async (id, options, sent) => {
  await app.db.query(
    sql`INSERT INTO users (message_id, options, sent) VALUES (${id}, ${options}, ${sent})`
  )
}
