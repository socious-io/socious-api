import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { PermissionError } from '../../utils/errors.js'
import { sorting, filtering } from '../../utils/query.js'

export const filterColumns = {
  status: String,
  requested_id: String,
  requester_id: String
}

export const sortColumns = ['created_at', 'updated_at', 'connected_at', 'status', 'requested_id', 'requester_id']

export const all = async (identityId, { offset = 0, limit = 10, filter, sort }) => {
  const { rows } = await app.db.query(
    sql`SELECT 
    COUNT(c.*) OVER () as total_count, c.*, row_to_json(i1.*) AS requested, row_to_json(i2.*) AS requester
    FROM connections c
    JOIN identities i1 ON i1.id=c.requested_id
    JOIN identities i2 ON i2.id=c.requester_id    
    WHERE (requested_id = ${identityId} OR requester_id=${identityId})
    ${filtering(filter, filterColumns, true, 'c')}
    ${sorting(sort, sortColumns, 'c')}
    LIMIT ${limit} OFFSET ${offset}`
  )

  return rows
}

export const get = async (id) => {
  return app.db.get(
    sql`SELECT c.*, row_to_json(i1.*) AS requested, row_to_json(i2.*) AS requester
    FROM connections c
    JOIN identities i1 ON i1.id=c.requested_id
    JOIN identities i2 ON i2.id=c.requester_id    
    WHERE c.id=${id}
  `
  )
}

export const requested = async (identityId, id) => {
  try {
    return app.db.get(
      sql`SELECT c.*, row_to_json(i1.*) AS requested, row_to_json(i2.*) AS requester
    FROM connections c
    JOIN identities i1 ON i1.id=c.requested_id
    JOIN identities i2 ON i2.id=c.requester_id    
    WHERE c.id=${id} AND requested_id = ${identityId}
  `
    )
  } catch {
    throw new PermissionError()
  }
}

export const requester = async (identityId, id) => {
  try {
    return app.db.get(
      sql`SELECT c.*, row_to_json(i1.*) AS requested, row_to_json(i2.*) AS requester
    FROM connections c
    JOIN identities i1 ON i1.id=c.requested_id
    JOIN identities i2 ON i2.id=c.requester_id    
    WHERE c.id=${id} AND requester_id = ${identityId}
  `
    )
  } catch {
    throw new PermissionError()
  }
}

export const permission = async (identityId, id) => {
  try {
    return app.db.get(
      sql`SELECT c.*, row_to_json(i1.*) AS requested, row_to_json(i2.*) AS requester
      FROM connections c
      JOIN identities i1 ON i1.id=c.requested_id
      JOIN identities i2 ON i2.id=c.requester_id    
      WHERE 
        c.id=${id} AND 
        (requester_id = ${identityId} OR requested_id = ${identityId})
    `
    )
  } catch {
    throw new PermissionError()
  }
}

export const related = async (identityId1, identityId2) => {
  try {
    return app.db.get(
      sql`SELECT c.*, row_to_json(i1.*) AS requested, row_to_json(i2.*) AS requester
      FROM connections c
      JOIN identities i1 ON i1.id=c.requested_id
      JOIN identities i2 ON i2.id=c.requester_id    
      WHERE 
        (
          (requester_id = ${identityId1} AND requested_id = ${identityId2}) OR
          (requester_id = ${identityId2} AND requested_id = ${identityId1})
        ) AND
        c.status <> 'BLOCKED'
    `
    )
  } catch {
    throw new PermissionError()
  }
}
