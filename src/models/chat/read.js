import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';
import {MemberTypes} from './enums.js';

export const all = async (identityId, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(
    sql`
    SELECT COUNT(*) OVER () as total_count, chats.*
      FROM chats JOIN chats_participants p ON p.chat_id=chats.id
    WHERE p.identity_id=${identityId}
    ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const get = async (id) => {
  return app.db.get(sql`SELECT * FROM chats WHERE id=${id}`);
};

export const messages = async (id, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, * FROM messages WHERE chat_id=${id} AND reply_id IS NULL
    ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `);
  return rows;
};

export const messagesReplies = async (id, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, * FROM messages WHERE reply_id=${id}
    ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `);
  return rows;
};

export const permissioned = async (
  identityId,
  id,
  type = MemberTypes.MEMBER,
) => {
  const {rows} = await app.db.query(sql`
    SELECT COUNT(*) from chats_participants
    WHERE chat_id=${id} AND identity_id=${identityId} AND type=${type}
  `);
  if (rows.length < 1) throw new PermissionError('Not allow');
};

export const participants = async (id, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, c.*, i.type  as identity_type, i.meta as identity_meta 
      FROM chats_participants c
      JOIN identities i ON c.identity_id=i.id
      WHERE chat_id=${id} 
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `);
  return rows;
};

export const miniParticipants = async (id) => {
  const {rows} = await app.db.query(
    sql`SELECT id, muted_until, identity_id FROM chats_participants WHERE chat_id=${id}`,
  );
  return rows;
};
