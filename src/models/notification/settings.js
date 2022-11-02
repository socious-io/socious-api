import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError} from '../../utils/errors.js';

export const settings = async (userId) => {
  const {rows} = await app.db.query(sql`
    SELECT 
      type, email, in_app, push
    FROM notifications_settings
    WHERE user_id=${userId}
  `);
  return rows;
};

export const updateSetting = async (userId, {type, email, in_app, push}) => {
  try {
    await app.db.query(sql`
    INSERT INTO notifications_settings (user_id, type, email, in_app, push)
    VALUES (${userId}, ${type}, ${email}, ${in_app}, ${push})
    ON CONFLICT (user_id, type)
    DO UPDATE SET email=EXCLUDED.email, in_app=EXCLUDED.in_app, push=EXCLUDED.push
  `);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const updateSettings = async (userId, notifSettings) => {
  await Promise.all(notifSettings.map((s) => updateSetting(userId, s)));
  return settings(userId);
};
