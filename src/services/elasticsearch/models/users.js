import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'users'
const indices = {
  index,
  fields: {
    //Full text search
    first_name: { type: 'text' },
    last_name: { type: 'text' },
    username: { type: 'keyword' },
    email: { type: 'keyword' },
    created_at: { type: 'date' },

    //Filters
    causes_tags: { type: 'keyword' }, //Filter: Social Causes
    skills: { type: 'keyword' }, //Filter: Skills
    city: { type: 'keyword' }, //Filter: Location
    country: { type: 'keyword' }, //Filter: Location
    timezone: { type: 'keyword' }, //Filter: Timezone
    // experience_level: { type: 'keyword' },//Filter: Experience Level //TODO: add to object after adding to preferences on users?
    // payment_type: { type: 'keyword' }, //Filter: Payment Type //TODO: add to object after adding to preferences on users?
    /*Payment Scheme: ? //TODO: add to object after adding to preferences on users?
        > Fixed: Multiple options
        > Hourly: Range
    */
    open_to_volunteer: { type: 'keyword' }, //Filter: Open To Volunteer
    preferences: {
      properties: {
        title: { type: 'keyword' },
        value: { type: 'keyword' },
        title_value: { type: 'keyword' }
      }
    }
  }
}

function transformer(document) {
  return {
    id: document.id,
    first_name: document.first_name,
    last_name: document.last_name,
    username: document.username,
    email: document.email,
    created_at: document.created_at,
    causes_tags: document.causes_tags ?? [],
    skills: document.skills ?? [],
    city: document.city,
    country: document.country,
    timezone: document.timezone,
    open_to_volunteer: document.open_to_volunteer,
    preferences: document.preferences.map((preference) => {
      return {
        ...preference,
        title_value: `${preference.title}:${preference.value}`
      }
    })
  }
}

const indexing = async ({ id }) => {
  const user = await app.db.get(
    sql`
    SELECT u.*, gn.timezone as timezone,
    COALESCE(
      (SELECT
        jsonb_agg(
          json_build_object(
            'title', pf.title, 
            'value', pf.value
          ) 
        )
        FROM preferences pf
        WHERE pf.identity_id=u.id
      ),
      '[]'
    ) AS preferences
    FROM users u
    LEFT JOIN geonames gn ON gn.id=u.geoname_id
    WHERE u.id=${id}
    `
  )

  console.log(user)
  const document = transformer(user)
  console.log(document)

  const indexingDocuments = [app.searchClient.indexDocument(index, document.id, document)]
  try {
    return await Promise.all(indexingDocuments)
  } catch (e) {
    console.log(e)
  }
}

async function getAllOrgs({ offset = 0, limit = 100 }) {
  const { rows } = await app.db.query(
    sql`
    SELECT u.*, gn.timezone as timezone,
    COALESCE(
      (SELECT
        jsonb_agg(
          json_build_object(
            'title', pf.title, 
            'value', pf.value
          ) 
        )
        FROM preferences pf
        WHERE pf.identity_id=u.id
      ),
      '[]'
    ) AS preferences
    FROM users u
    LEFT JOIN geonames gn ON gn.id=u.geoname_id
    LIMIT ${limit} OFFSET ${offset}
    `
  )

  return rows
}

const initIndexing = async () => {
  let offset = 0,
    limit = 1000,
    count = 0,
    users = []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    users = await getAllOrgs({ limit, offset })
    if (users.length < 1) break
    console.log(await app.searchClient.bulkIndexDocuments(index, users.map(transformer)))
    count += users.length
    offset += limit
  }

  return { count }
}

export default {
  indices,
  indexing,
  initIndexing
}
