import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {newChatSchem, updateChatSchem, messageUpsertSchem} from './schema.js';
import {EntryError, NotImplementedError} from '../../utils/errors.js';
import {MemberTypes, Types} from './enums.js';
import {find} from './read.js';

export const create = async (identityId, body) => {
  if (body.type !== Types.CHAT) throw new NotImplementedError();
  const existing = find(identityId, body);
  if (existing.length > 0) return existing[0];

  await newChatSchem.validateAsync(body);
  const participants = body.participants.map((id) => id.toLowerCase());
  if (!participants.includes(identityId)) participants.push(identityId);
  participants.sort();

  await app.db.query('BEGIN');
  try {
    const {rows} = await app.db.query(sql`
      INSERT INTO chats (name, description, type, participants, created_by)
        VALUES (${body.name}, ${body.description}, ${body.type}, ${participants}, ${identityId})
        RETURNING *
    `);
    const chat = rows[0];
    await Promise.all(
      participants.map((p) => addParticipant(chat.id, p, identityId)),
    );
    await app.db.query('COMMIT');
    return chat;
  } catch (err) {
    await app.db.query('ROLLBACK');
    throw new EntryError(err.message);
  }
};

export const update = async (id, body) => {
  await updateChatSchem.validateAsync(body);
  try {
    const {rows} = await app.db.query(sql`
      UPDATE chats
        SET name=${body.name}, 
          description=${body.description}
        WHERE id=${id}
        RETURNING *
    `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  try {
    const {rows} = await app.db.query(sql`DELETE FROM chats WHERE id=${id}`);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const addParticipant = async (
  chatId,
  participantId,
  joinedById,
  type = MemberTypes.MEMBER,
) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO chats_participants (identity_id, chat_id, type, joined_by)
    VALUES (${participantId}, ${chatId}, ${type}, ${joinedById}) RETURNING id
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const permitParticipant = async (chatId, participantId, type) => {
  try {
    const {rows} = await app.db.query(sql`
    UPDATE chats_participants 
      SET type=${type}
    WHERE chat_id=${chatId} AND identity_id=${participantId} RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const muteParticipant = async (chatId, participantId, until) => {
  try {
    const {rows} = await app.db.query(sql`
    UPDATE chats_participants 
      SET muted_until=${until}
    WHERE chat_id=${chatId} AND identity_id=${participantId}
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const removeParticipant = async (chatId, participantId) => {
  try {
    const {rows} = await app.db.query(sql`
    DELETE FROM chats_participants 
      WHERE chat_id=${chatId} AND identity_id=${participantId}
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const newMessage = async (chatId, identityId, body, replyId = null) => {
  await messageUpsertSchem.validateAsync(body);
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO messages (identity_id, chat_id, text, reply_id, media)
    VALUES (${identityId}, ${chatId}, ${body.text}, ${replyId}, ${body.media}) RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const editMessage = async (id, identityId, body) => {
  await messageUpsertSchem.validateAsync(body);
  try {
    const {rows} = await app.db.query(sql`
    UPDATE messages 
      SET text=${body.text},
      media=${body.media}
    WHERE id=${id} AND identity_id=${identityId} 
    RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const removeMessage = async (id, identityId) => {
  return app.db.query(sql`
    DELETE FROM messages
    WHERE id=${id} AND identity_id=${identityId} 
  `);
};

export const getMessage = async (id) => {
  return app.db.get(sql`SELECT * FROM messages WHERE id=${id}`);
};

export const readMessage = async (id, identityId) => {
  const selected = await app.db.get(sql`
    SELECT c.id AS chat_id, 
      c.updated_at AS chat_updated_at, 
      m.created_at AS created_at 
    FROM messages m JOIN chats c ON c.id=m.chat_id 
    WHERE m.id=${id}
  `);
  try {
    const {rows} = await app.db.query(sql`
      UPDATE chats_participants
      SET last_read_id=${id}, 
        last_read_at=${selected.created_at}, 
        all_read=${selected.chat_updated_at <= selected.created_at}
      WHERE chat_id=${selected.chat_id} AND identity_id=${identityId}
      RETURNING *
    `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};
