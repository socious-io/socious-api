import sql, { raw } from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import Data from '@socious/data'
import Connect from '../connect/index.js'
import { sorting } from '../../utils/query.js'

export const sortColumns = ['updated_at', 'created_at']

export const all = async (identityId, { offset = 0, limit = 10, sort }) => {
  const { rows } = await app.db.query(
    sql`
    SELECT COUNT(*) OVER () as total_count, chats.*,
    EXISTS(SELECT r.id FROM reports r WHERE r.user_id=p.identity_id AND r.identity_id=${identityId} AND blocked=true) AS blocked
    FROM chats
    JOIN chats_participants p ON p.chat_id=chats.id
    WHERE p.identity_id=${identityId}
    ${sorting(sort, sortColumns, 'chats')}
    LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const filtered = async (identityId, { offset = 0, limit = 10, sort }, filter) => {
  const { rows } = await app.db.query(
    sql`
    SELECT COUNT(*) OVER () as total_count, chats.*,
    EXISTS(SELECT r.id FROM reports r WHERE r.user_id=p.identity_id AND r.identity_id=${identityId} AND blocked=true) AS blocked
    FROM chats
    JOIN chats_participants p ON p.chat_id=chats.id
    JOIN chats_participants p2 ON (p2.chat_id=chats.id and p.id!=p2.id)
    JOIN identities i ON i.id=p2.identity_id 
    WHERE p.identity_id=${identityId}
    AND position(${filter.toLowerCase()} IN lower(i.meta->>'name')) > 0
    ${sorting(sort, sortColumns, 'chats')}
    LIMIT ${limit} OFFSET ${offset}`
  )
  return rows
}

export const find = async (identityId, { participants }) => {
  participants = participants.map((id) => id.toLowerCase())
  if (!participants.includes(identityId)) participants.push(identityId)
  participants.sort()

  const { rows } = await app.db.query(
    sql`
    SELECT *
    FROM chats
    WHERE participants=${participants}
    ORDER BY updated_at DESC`
  )
  return rows
}

export const get = async (id) => {
  return app.db.get(sql`SELECT * FROM chats WHERE id=${id}`)
}

export const getAll = async (ids) => {
  const { rows } = await app.db.query(sql`SELECT * FROM chats WHERE id=ANY(${ids})`)
  return rows
}

export const messages = async (id, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, messages.*, media.url as media_url
    FROM messages
    LEFT JOIN media AS media ON media.id = media
    WHERE chat_id=${id} AND reply_id IS NULL AND deleted_at IS NULL
    ORDER BY messages.created_at DESC LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const getMessage = async (id) => {
  const { rows } = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, messages.*, media.url as media_url
    FROM messages
    LEFT JOIN media AS media ON media.id = media
    WHERE id=${id}
  `)
  return rows
}

export const messagesReplies = async (id, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, messages.*, media.url as media_url
    FROM messages
    LEFT JOIN media AS media ON media.id = media
    WHERE reply_id=${id} AND deleted_at IS NULL
    ORDER BY messages.created_at DESC LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const permissioned = async (identityId, id, type) => {
  let typeFilter = raw('')

  if (type) typeFilter = sql`AND type=${type}`

  const { rows } = await app.db.query(sql`
    SELECT COUNT(*) from chats_participants
    WHERE chat_id=${id} AND identity_id=${identityId} ${typeFilter}
  `)

  if (rows[0].count < 1) throw new PermissionError('Not allow')
}

export const participants = async (id, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, c.*, i.type  as identity_type, i.meta as identity_meta 
      FROM chats_participants c
      JOIN identities i ON c.identity_id=i.id
      WHERE chat_id=${id} 
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export const miniParticipants = async (id) => {
  const { rows } = await app.db.query(
    sql`SELECT id, muted_until, identity_id FROM chats_participants WHERE chat_id=${id}`
  )
  return rows
}

export const summary = async (identityId, { offset = 0, limit = 10, sort }, filter) => {
  const chats = await (filter
    ? filtered(identityId, { offset, limit, sort }, filter)
    : all(identityId, { offset, limit, sort }))

  await app.db.with(async (client) => {
    for (const chat of chats) {
      chat.participation = await client.get(sql`
        SELECT c.type, c.muted_until, c.last_read_at, c.last_read_id, c.all_read
          FROM chats_participants c
          WHERE chat_id=${chat.id} and identity_id = ${identityId}
      `)
      const { rows: messages } = await client.query(sql`
        SELECT * FROM messages WHERE chat_id=${chat.id} AND deleted_at IS NULL
        ORDER BY created_at DESC LIMIT 1
      `)
      if (messages.length) chat.last_message = messages[0]
      chat.message_count = (
        await client.get(sql`
        SELECT COUNT(*) FROM messages WHERE chat_id=${chat.id} AND deleted_at IS NULL
      `)
      ).count
      if (chat.participation.last_read_at) {
        chat.unread_count = (
          await client.get(sql`
          SELECT COUNT(*) FROM messages
          WHERE chat_id=${chat.id}
          AND created_at > ${chat.participation.last_read_at} AND id != ${chat.participation.last_read_id}
          AND deleted_at IS NULL
        `)
        ).count
      } else chat.unread_count = chat.message_count
      const { rows: participants } = await client.query(sql`
        SELECT c.type, c.all_read, c.last_read_id, c.last_read_at, i.type as identity_type, i.meta as identity_meta 
          FROM chats_participants c
          JOIN identities i ON c.identity_id=i.id
          WHERE chat_id=${chat.id} and identity_id != ${identityId}
      `)
      chat.participants = participants
    }
  })

  return chats
}

export const chatPermission = async (identity, participantId) => {
  // Access to ORGs to add any participants
  if (identity.type === Data.IdentityType.ORG) return true
  try {
    await Connect.related(identity.id, participantId)
  } catch {
    throw new PermissionError("identities didn't connect")
  }
}

export const unreadCount = async (identityId) => {
  const row = await app.db.get(sql`
    SELECT COUNT(m.*) FROM chats c 
    JOIN messages m ON m.chat_id=c.id 
    JOIN chats_participants p ON p.chat_id=c.id 
    WHERE p.identity_id=${identityId} AND m.created_at > p.last_read_at AND m.id != p.last_read_id
  `)
  return { count: parseInt(row.count) }
}
