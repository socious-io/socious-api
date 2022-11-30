import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

export const escrow = async (trxId, currency, projectId, amount) => {
  try {
    const rows = await app.db.query(sql`
    INSERT INTO escrows (project_id, payment_id, amount, currency)
      VALUES(${projectId}, ${trxId}, ${amount}, ${currency})
    RETURNING *
  `);

    return rows[0];
  } catch (err) {
    throw EntryError(err.message);
  }
};

export const totalEscrow = async (projectId) => {
  const row = await app.db.get(sql`
    SELECT SUM(amount) FROM escrows WHERE project_id=${projectId} AND released_at IS NULL
  `);

  return row.sum;
};
