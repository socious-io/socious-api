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

  try {
    const res = await app.db.query(sql`UPDATE projects SET status = 'EXPIRE'
      WHERE status <> 'EXPIRE' AND (other_party_id = ANY(${ids}) OR expires_at < NOW())`);

    if (res.rowCount > 0) {
      count = res.rowCount;
      //console.log(`${count} projects updated to EXPIRE.`);
    }
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err.message);
  }

  return count;
}
