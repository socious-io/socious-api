import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'organizations'
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
    //Full Text Search
    name: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    bio: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    description: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    shortname: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    mission: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        }
      }
    },
    address: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        }
      }
    },
    email: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        }
      }
    },
    phone: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          normalizer: 'case_insensitive_normalizer'
        }
      }
    },

    //Filters
    social_causes: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Social Causes
    id: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Organization
    type: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Organization Type
    size: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Organization Size
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
    },
    verified: {
      type: 'boolean'
    }
  }
}

function transformer(document) {
  return {
    name: document.name,
    bio: document.bio,
    description: document.description,
    shortname: document.shortname,
    mission: document.mission,
    address: document.address,
    email: document.email,
    phone: document.phone,
    social_causes: document.social_causes,
    id: document.id,
    size: document.size,
    type: document.type,
    city: document.city,
    country: document.country,
    timezone: document.timezone,
    //payment options
    //Equity / tokens
    preferences: document.preferences.map((preference) => {
      return {
        ...preference,
        title_value: `${preference.title}:${preference.value}`
      }
    }),
    verified: document.verified
  }
}

const indexing = async ({ id }) => {
  const organization = await app.db.get(
    sql`
    SELECT o.*, gn.timezone,
    COALESCE(
      (SELECT
        jsonb_agg(
          json_build_object(
            'title', pf.title, 
            'value', pf.value
          ) 
        )
        FROM preferences pf
        WHERE pf.identity_id=o.id
      ),
      '[]'
    ) AS preferences
    FROM organizations o
    LEFT JOIN geonames gn ON gn.id=o.geoname_id
    WHERE o.id=${id}
    `
  )

  const document = transformer(organization)

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
    SELECT o.*, gn.timezone,
    COALESCE(
      (SELECT
        jsonb_agg(
          json_build_object(
            'title', pf.title, 
            'value', pf.value
          ) 
        )
        FROM preferences pf
        WHERE pf.identity_id=o.id
      ),
      '[]'
    ) AS preferences
    FROM organizations o
    LEFT JOIN geonames gn ON gn.id=o.geoname_id
    LIMIT ${limit} OFFSET ${offset}
    `
  )

  return rows
}

const initIndexing = async () => {
  let offset = 0,
    limit = 10000,
    count = 0,
    orgs = []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    orgs = await getAllOrgs({ limit, offset })
    if (orgs.length < 1) break
    await app.searchClient.bulkIndexDocuments(index, orgs.map(transformer))
    count += orgs.length
    offset += limit
  }

  return { count }
}

export default {
  indices,
  indexing,
  initIndexing
}
