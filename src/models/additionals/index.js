import sql from 'sql-template-tag'

import { app } from '../../index.js'
import { EntryError } from '../../utils/errors.js'

const insert = async (
  identity_id,
  { type, title, description, url, image, sub_image, meta, ref_identity_id, enabled }
) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO additionals (type, title, description, url, image, sub_image, meta, identity_id, ref_identity_id, enabled)
      VALUES(${type}, ${title}, ${description}, ${url}, ${image}, ${sub_image}, ${meta}, ${identity_id}, ${ref_identity_id}, ${enabled})
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

const update = async (id, { title, description, url, image, sub_image, meta, enabled }) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE additionals SET 
      title=${title},
      description=${description},
      url=${url},
      image=${image},
      sub_image=${sub_image},
      meta=${meta},
      enabled=${enabled}
    WHERE id=${id}
    RETURNING *
  `)
    return rows[0]
  } catch (err) {
    throw new EntryError(err.message)
  }
}

const remove = async (id) => {
  return app.db.query(sql`DELETE FROM additionals WHERE id=${id}`)
}

const get = async (id) => {
  return app.db.get(sql`SELECT * FROM additionals WHERE id=${id}`)
}

export default {
  insert,
  update,
  remove,
  get
}
