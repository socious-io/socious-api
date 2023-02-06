import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { EntryError, NotImplementedError } from '../../utils/errors.js'
import Data from '@socious/data'
import { find, chatPermission } from './read.js'

const MemberTypes = Data.ChatMemberType
const Types = Data.ChatType

export const create = async (identity, { type, participants, description, name }) => {
  if (type !== Types.CHAT) throw new NotImplementedError()

  participants = participants.map((id) => id.toLowerCase())

  await Promise.all(participants.filter((p) => p !== identity.id).map((p) => chatPermission(identity, p)))

  if (!participants.includes(identity.id)) participants.push(identity.id)
  participants.sort()

  const existing = await find(identity.id, { participants })
  if (existing.length > 0) return existing[0]
  return app.db.with(async (client) => {
    await client.query('BEGIN')
    try {
      const { rows } = await client.query(sql`
      INSERT INTO chats (name, description, type, participants, created_by)
        VALUES (${name}, ${description}, ${type}, ${participants}, ${identity.id})
        RETURNING *
    `)
      const chat = rows[0]
      await Promise.all(
        participants
          // current Identity will add automaticly as ADMIN
          .filter((p) => p !== identity.id)
          .map((p) => addParticipant(chat.id, p, identity.id, MemberTypes.MEMBER, client))
      )
      await client.query('COMMIT')
      return chat
    } catch (err) {
      await client.query('ROLLBACK')
      throw new EntryError(err.message)
    }
  })
}

export const update = async (id, { name, description }) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE chats
        SET name=${name}, 
          description=${description}
        WHERE id=${id}
        RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const remove = async (id) => {
  try {
    const { rows } = await app.db.query(sql`DELETE FROM chats WHERE id=${id}`)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const addParticipant = async (chatId, participantId, joinedById, type = MemberTypes.MEMBER, client) => {
  try {
    const db = client || app.db
    const { rows } = await db.query(sql`
    INSERT INTO chats_participants (identity_id, chat_id, type, joined_by)
    VALUES (${participantId}, ${chatId}, ${type}, ${joinedById}) RETURNING id
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const permitParticipant = async (chatId, participantId, type) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE chats_participants 
      SET type=${type}
    WHERE chat_id=${chatId} AND identity_id=${participantId} RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const muteParticipant = async (chatId, participantId, until) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE chats_participants 
      SET muted_until=${until}
    WHERE chat_id=${chatId} AND identity_id=${participantId}
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeParticipant = async (chatId, participantId) => {
  try {
    const { rows } = await app.db.query(sql`
    DELETE FROM chats_participants 
      WHERE chat_id=${chatId} AND identity_id=${participantId}
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const newMessage = async (chatId, identityId, { text, media }, replyId = null) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO messages (identity_id, chat_id, text, reply_id, media)
    VALUES (${identityId}, ${chatId}, ${text}, ${replyId}, ${media}) RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const editMessage = async (id, identityId, { text, media }) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE messages 
      SET text=${text},
      media=${media}
    WHERE id=${id} AND identity_id=${identityId} 
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const removeMessage = async (id, identityId) => {
  return app.db.query(sql`
    DELETE FROM messages
    WHERE id=${id} AND identity_id=${identityId} 
  `)
}

export const getMessage = async (id) => {
  return app.db.get(sql`
  SELECT m.*, i.type AS identity_type, i.meta AS identity_meta
  FROM messages m
  JOIN identities i ON i.id=m.identity_id
  WHERE m.id=${id}
  `)
}

export const readMessage = async (id, identityId) => {
  const selected = await app.db.get(sql`
    SELECT c.id AS chat_id, 
      c.updated_at AS chat_updated_at, 
      m.created_at AS created_at 
    FROM messages m JOIN chats c ON c.id=m.chat_id 
    WHERE m.id=${id}
  `)
  try {
    const { rows } = await app.db.query(sql`
      UPDATE chats_participants
      SET last_read_id=${id}, 
        last_read_at=${selected.created_at}, 
        all_read=${selected.chat_updated_at <= selected.created_at}
      WHERE chat_id=${selected.chat_id} AND identity_id=${identityId}
      RETURNING *
    `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}
