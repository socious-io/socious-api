import sql from 'sql-template-tag';
import {EntryError} from '../../utils/errors.js';
import {app} from '../../index.js';

import {get} from './read.js';

export const complete = async (employeeId) => {
  try {
    const {rows} = await app.db.query(sql`
    UPDATE employees SET 
      status='COMPLETE', 
      complete_at=now(),
      updated_at=now()
    WHERE id=${employeeId} AND status='ACTIVE'
    RETURNING id
    `);
    return get(rows[0].id);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const confirm = async (employeeId) => {
  try {
    const {rows} = await app.db.query(sql`
    UPDATE employees SET 
      status='CONFIRMED',
      updated_at=now()
    WHERE id=${employeeId} AND status='COMPLETE'
    RETURNING id
    `);
    return get(rows[0].id);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const cancel = async (employeeId) => {
  try {
    const {rows} = await app.db.query(sql`
    UPDATE employees SET 
      status='CANCELED', 
      updated_at=now()
    WHERE id=${employeeId} AND status='ACTIVE'
    RETURNING id
    `);
    return get(rows[0].id);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const kickout = async (employeeId) => {
  try {
    const {rows} = await app.db.query(sql`
    UPDATE employees SET 
      status='KICKED_OUT', 
      updated_at=now()
    WHERE id=${employeeId} AND status='ACTIVE'
    RETURNING id
    `);
    return get(rows[0].id);
  } catch (err) {
    throw new EntryError(err.message);
  }
};
