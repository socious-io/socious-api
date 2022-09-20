import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {PermissionError} from '../../utils/errors.js';
import Data from '@socious/data';
import Identity from '../identity/index.js';

const MemberTypes = Data.ChatMemberType

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

export const filtered = async (
  identityId,
  {offset = 0, limit = 10},
  filter,
) => {
  const {rows} = await app.db.query(
    sql`
    SELECT COUNT(*) OVER () as total_count, chats.*
    FROM chats
    JOIN chats_participants p ON p.chat_id=chats.id
    JOIN chats_participants p2 ON (p2.chat_id=chats.id and p.id!=p2.id)
    JOIN identities i ON i.id=p2.identity_id 
    WHERE p.identity_id=${identityId}
    AND position(${filter.toLowerCase()} IN lower(i.meta->>'name')) > 0
    ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
  );
  return rows;
};

export const find = async (identityId, {participants}) => {
  participants = participants.map((id) => id.toLowerCase());
  if (!participants.includes(identityId)) participants.push(identityId);
  participants.sort();

  const {rows} = await app.db.query(
    sql`
    SELECT COUNT(*) OVER () as total_count, chats.*
    FROM chats
    WHERE participants=${participants}
    ORDER BY created_at`,
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

export const getMessage = async (id) => {
  const {rows} = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, messages.*, media.url as media_url
    FROM messages
    LEFT JOIN media AS media ON media.id = media
    WHERE id=${id}
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

export const summary = async (identityId, {offset = 0, limit = 10}, filter) => {
  const chats = await (filter
    ? filtered(identityId, {offset, limit}, filter)
    : all(identityId, {offset, limit}));

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
          SELECT COUNT(*) FROM messages
          WHERE chat_id=${chat.id}
          AND created_at > ${chat.participation.last_read_at} AND id != ${chat.participation.last_read_id}
          AND deleted_at IS NULL
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

export const addParticipantPermission = async (identity, participantId) => {
  // Access to ORGs to add any participants
  if (identity.type === Data.IdentityType.ORG) return;

  const participant = await Identity.get(participantId, identity.id);

  // All may access to create chat to ORG
  if (participant.type === Data.IdentityType.ORG) return;

  // Deny access if participant not followed
  if (!participant.following) throw new PermissionError();
};
