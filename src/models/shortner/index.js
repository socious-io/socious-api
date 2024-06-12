import sql from 'sql-template-tag'
import { app } from '../../index.js'

export const get = async (shortId) => {
  return app.db.get(sql`SELECT * FROM urls_shortens WHERE short_id=${shortId}`)
}

export const create = async (url) => {
  return app.db.get(sql`
    INSERT INTO urls_shortens (long_url) VALUES (${url}) 
    ON CONFLICT (long_url) DO NOTHING
    RETURNING *
  `)
}

export default {
  get,
  create
}
