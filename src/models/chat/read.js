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
    SELECT COUNT(*) OVER () as total_count, messages.*, media.url as media_url
    FROM messages
    LEFT JOIN media AS media ON media.id = media
    WHERE chat_id=${id} AND reply_id IS NULL AND deleted_at IS NULL
    ORDER BY messages.created_at DESC LIMIT ${limit} OFFSET ${offset}
  `);
  return rows;
};

export const messagesReplies = async (id, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, messages.*, media.url as media_url
    FROM messages
    LEFT JOIN media AS media ON media.id = media
    WHERE reply_id=${id} AND deleted_at IS NULL
    ORDER BY messages.created_at DESC LIMIT ${limit} OFFSET ${offset}
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

export const summary = async (identityId, {offset = 0, limit = 10}) => {
  const chats = await all(identityId, {offset, limit});

  await app.db.with(async (client) => {
    for (const chat of chats) {
      chat.participation = await client.get(sql`
        SELECT c.type, c.muted_until, c.last_read_at, c.last_read_id, c.all_read
          FROM chats_participants c
          WHERE chat_id=${chat.id} and identity_id = ${identityId}
      `);
      const {rows: messages} = await client.query(sql`
        SELECT * FROM messages WHERE chat_id=${chat.id} AND deleted_at IS NULL
        ORDER BY created_at DESC LIMIT 1
      `);
      if (messages.length) chat.last_message = messages[0];
      chat.message_count = (
        await client.get(sql`
        SELECT COUNT(*) FROM messages WHERE chat_id=${chat.id} AND deleted_at IS NULL
      `)
      ).count;
      if (chat.participation.last_read_at) {
        chat.unread_count = (
          await client.get(sql`
          SELECT COUNT(*) FROM messages WHERE chat_id=${chat.id} AND created_at > ${chat.participation.last_read_at} AND deleted_at IS NULL
        `)
        ).count;
      } else chat.unread_count = chat.message_count;
      const {rows: participants} = await client.query(sql`
        SELECT c.type, c.all_read, c.last_read_id, c.last_read_at, i.type as identity_type, i.meta as identity_meta 
          FROM chats_participants c
          JOIN identities i ON c.identity_id=i.id
          WHERE chat_id=${chat.id} and identity_id != ${identityId}
      `);
      chat.participants = participants;
    }
  });

  return chats;
};
