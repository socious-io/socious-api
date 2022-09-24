import sql from 'sql-template-tag';
import {app} from '../../index.js';

/**
 * Set project status to EXPIRE
 *
 * @param {array} ids
 * @returns int
 */
export async function expireProjects(ids) {
  let count = 0;

  for (let y = 0; y < ids.length; y++) {
    try {
      const res = await app.db.query(sql`UPDATE projects SET status = 'EXPIRE'
      WHERE status <> 'EXPIRE' AND
      (other_party_id = ${ids[y]} OR expires_at < NOW())`);

      if (res.rowCount > 0) {
        console.log(`found ID ${ids[y]}`);
        count++;
      }
    } catch (err) {
      console.log('\x1b[31m%s\x1b[0m', err.message);
    }
  }
  return count;
}
