import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { NotFoundError, PermissionError } from '../../utils/errors.js'

export const getAllByIdentity = async (identityId) => {
  const { rows } = await app.db.query(
    sql`
      SELECT title, value, description FROM preferences
      WHERE identity_id=${identityId}
    `
  )
  return rows
}

export const getOneByIdentityAndTitle = async (identityId, title) => {
  try {
    return await app.db.get(
      sql`
      SELECT * FROM preferences
      WHERE identity_id=${identityId} AND title=${title}
    `
    )
  } catch (e) {
    throw new NotFoundError()
  }
}
