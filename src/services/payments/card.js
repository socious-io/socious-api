import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { filtering } from '../../utils/query.js'
import { EntryError } from '../../utils/errors.js'

export const sortColumns = ['created_at', 'updated_at']

export const filterColumns = {
  is_jp: Boolean
}

export const getCard = async (id, identityId) => {
  return app.db.get(sql`SELECT * FROM cards WHERE id=${id} AND identity_id=${identityId}`)
}

export const getCards = async (identityId, { limit = 10, offset = 0, filter }) => {
  const { rows } = await app.db.query(sql`
    SELECT 
      COUNT(*) OVER () as total_count, * 
    FROM cards 
    WHERE identity_id=${identityId}
    ${filtering(filter, filterColumns, false)}
    ORDER BY created_at DESC    
    LIMIT ${limit} OFFSET ${offset}    
  `)
  return rows
}

export const newCard = async (identityId, { holder_name, customer, meta, brand, is_jp }) => {
  try {
    const { rows } = await app.db.query(sql`
      INSERT INTO cards (identity_id, holder_name, customer, meta, brand, is_jp)
      VALUES (${identityId}, ${holder_name}, ${customer}, ${meta}, ${brand}, ${is_jp})
      RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err)
  }
}

export const updateCardBrand = async (id, brand) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE cards SET brand=${brand}, updated_at=now() WHERE id=${id}
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err)
  }
}

export const updateCard = async (id, identityId, { holder_name, customer, meta, brand, is_jp }) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE cards SET 
        holder_name=${holder_name}, 
        customer=${customer},
        is_jp=${is_jp},
        meta=${meta},
        brand=${brand}
      WHERE id=${id} AND identity_id=${identityId}
      RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err)
  }
}

export const removeCard = async (id, identityId) => {
  return app.db.query(sql`DELETE FROM cards WHERE id=${id} AND identity_id=${identityId}`)
}
