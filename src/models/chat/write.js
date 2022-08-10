import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {newChatSchem, updateChatSchem} from './schema.js';
import {EntryError} from '../../utils/errors.js';
import {MemberTypes} from './enums.js';

export const create = async (identityId, body) => {
  await newChatSchem.validateAsync(body);
  await app.db.query('BEGIN');
  try {
    const {rows} = await app.db.query(sql`
      INSERT INTO chats (name, description, type, created_by)
        VALUES (${body.name}, ${body.description}, ${body.type}, ${identityId})
        RETURNING *
    `);
    const chat = rows[0];    
    await addParticipant(chat.id, identityId, identityId, MemberTypes.ADMIN)
    await Promise.all(
      body.participants.map((p) => addParticipant(chat.id, p, identityId)),
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
          description=${body.description},
          type=${body.type}
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

export const newMessage = async (chatId, identityId, text, replyId = null) => {
  try {
    const {rows} = await app.db.query(sql`
    INSERT INTO messages (identity_id, chat_id, text, reply_id)
    VALUES (${identityId}, ${chatId}, ${text}, ${replyId}) RETURNING *
  `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const editMessage = async (id, identityId, text) => {
  try{
  const {rows} = await app.db.query(sql`
    UPDATE messages 
      SET text=${text}
    WHERE id=${id} AND identity_id=${identityId} 
    RETURNING *
  `);
  return rows[0]
  }
  catch(err) {
    throw new EntryError(err.message);
  }
  
};

export const removeMessage = async (id, identityId) => {
  return app.db.query(sql`
    DELETE FROM messages
    WHERE id=${id} AND identity_id=${identityId} 
  `);
};

export const readMessage = async (id) => {
  return app.db.query(sql`UPDATE messages SET read_at=now() WHERE id=${id}`);
};
