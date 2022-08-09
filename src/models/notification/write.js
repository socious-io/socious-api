import sql from 'sql-template-tag';
import {app} from '../../index.js';
import { EntryError } from '../../utils/errors.js';


export const create = async(userId, refId, notifType,  data) => {
  try {
  const {rows} = await app.db.query(sql`
    INSERT INTO notifications (type, ref_id, user_id, data)
      VALUES(${notifType}, ${refId}, ${userId}, ${data})
      RETURNING *
  `)
    return rows[0];
  } catch(err) {
    throw new EntryError(err.message);
  }
}

export const readAll = async (userId) => {
  return app.db.query(sql`
    UPDATE notifications 
      SET read_at=now() 
    WHERE user_id=${userId} 
      AND read_at IS NULL`)
}


export const read = async (userId, ids) => {
  return app.db.query(sql`
    UPDATE notifications 
      SET read_at=now() 
    WHERE user_id=${userId}
      AND id=ANY(${ids})
      AND read_at IS NULL`)
}

export const viewed = async (userId, ids) => {
  return app.db.query(sql`
    UPDATE notifications 
      SET view_at=now() 
    WHERE user_id=${userId} 
      AND id=ANY(${ids}) 
      AND view_at IS NULL`)
}

export const unreadCount = async (userId) => {
  return app.db.get(sql`
    SELECT COUNT(*) FROM notifications 
      WHERE user_id=${userId} AND read_at IS NULL`)
}
