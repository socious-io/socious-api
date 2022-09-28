import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

export const create = async ({
  identity_id,
  amount,
  currency,
  service,
  meta,
}) => {
  try {
    const {rows} = await app.db.query(sql`
  INSERT INTO payments (identity_id, amount, currency, service, meta)
  VALUES (${identity_id}, ${amount}, ${currency}, ${service}, ${meta})
  RETURNING *
  `);
    return rows[0].id;
  } catch (err) {
    throw new EntryError(err);
  }
};

export const setTransaction = async (id, transaction) => {
  try {
    const {rows} = await app.db.query(sql`
      UPDATE payments SET transaction_id=${transaction} WHERE id=${id}
      RETURNING *
    `);
    return rows[0].id;
  } catch (err) {
    throw new EntryError(err);
  }
};

export const complete = async (id) => {
  try {
    const {rows} = await app.db.query(sql`
      UPDATE payments SET verified_at=now() WHERE id=${id}
      RETURNING *
    `);
    return rows[0].id;
  } catch (err) {
    throw new EntryError(err);
  }
};

export const cancel = async (id) => {
  try {
    const {rows} = await app.db.query(sql`
      UPDATE payments SET canceled_at=now() WHERE id=${id}
      RETURNING *
    `);
    return rows[0].id;
  } catch (err) {
    throw new EntryError(err);
  }
};

export const get = async (id) => {
  return app.db.get(sql`SELECT * FROM payments WHERE id=${id}`);
};
