import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { NotFoundError } from '../../utils/errors.js'

export const getAllByIdentity = async (identityId) => {
  const { rows } = await app.db.query(
    sql`
      SELECT title, value, description FROM preferences
      WHERE identity_id=${identityId}
    `
  )
  return rows
}
