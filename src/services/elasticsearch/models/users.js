import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'users'
const indices = {
  index,
  settings: {
    analysis: {
      normalizer: {
        case_insensitive_normalizer: {
          type: 'custom',
          filter: ['lowercase']
        }
      }
    }
  },
  fields: {
    //Full text search
    first_name: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    last_name: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    username: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    email: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    created_at: {
      type: 'date'
    },

    //Filters
    languages: {
      properties: {
        name: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        },
        level: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        },
        name_level: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        }
      }
    },
    social_causes: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Social Causes
    skills: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Skills
    city: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Location
    country: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Location
    timezone: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Timezone
    // experience_level: { type: 'keyword' },//Filter: Experience Level //TODO: add to object after adding to preferences on users?
    // payment_type: { type: 'keyword' }, //Filter: Payment Type //TODO: add to object after adding to preferences on users?
    /*Payment Scheme: ? //TODO: add to object after adding to preferences on users?
        > Fixed: Multiple options
        > Hourly: Range
    */
    open_to_volunteer: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Open To Volunteer
    preferences: {
      properties: {
        title: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        },
        value: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        },
        title_value: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        }
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
    social_causes: document.social_causes ?? [],
    skills: document.skills ?? [],
    languages: document.languages.map((language) => {
      return {
        ...language,
        name_level: `${language.name}:${language.level}`
      }
    }),
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
  let document
  const indexingDocuments = []

  try {
    const user = await app.db.get(
      sql`
      SELECT u.*, array_to_json(u.social_causes) AS social_causes, gn.timezone as timezone,
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
      ) AS preferences,
      COALESCE(
        (SELECT
          jsonb_agg(
            json_build_object(
              'name', l.name, 
              'level', l.level
            ) 
          )
          FROM languages l
          WHERE l.user_id=u.id
        ),
        '[]'
      ) AS languages
      FROM users u
      LEFT JOIN geonames gn ON gn.id=u.geoname_id
      WHERE u.id=${id}
      `
    )

    document = transformer(user)
    indexingDocuments.push(app.searchClient.indexDocument(index, document.id, document))
  } catch (e) {
    indexingDocuments.push(app.searchClient.deleteDocument(index, id))
  }

  try {
    return await Promise.all(indexingDocuments)
  } catch (e) {
    console.log(e)
  }
}

async function getAllOrgs({ offset = 0, limit = 100 }) {
  const { rows } = await app.db.query(
    sql`
    SELECT u.*, array_to_json(u.social_causes) AS social_causes, gn.timezone as timezone,
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
    ) AS preferences,
    COALESCE(
      (SELECT
        jsonb_agg(
          json_build_object(
            'name', l.name, 
            'level', l.level
          ) 
        )
        FROM languages l
        WHERE l.user_id=u.id
      ),
      '[]'
    ) AS languages
    FROM users u
    LEFT JOIN geonames gn ON gn.id=u.geoname_id
    LIMIT ${limit} OFFSET ${offset}
    `
  )

  return rows
}

const initIndexing = async () => {
  let offset = 0,
    limit = 10000,
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
