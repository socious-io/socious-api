import sql from 'sql-template-tag'
import { app } from '../../index.js'
import { sorting } from '../../utils/query.js'

export const sortColumns = ['name', 'population', 'id']

export const getAll = async (ids, sort) => {
  const { rows } = await app.db.query(sql`
    SELECT COUNT(*) OVER () as total_count, con.*
    FROM countries con
    WHERE con.id=ANY(${ids})
    ${sorting(sort, sortColumns, 'con')}
  `)
  return rows
}
