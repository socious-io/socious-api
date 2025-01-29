import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'projects'
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
    title: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    description: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    other_party_title: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },
    other_party_url: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer',
      fields: {
        text: {
          type: 'text'
        }
      }
    },

    //Filters
    causes_tags: {
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
    remote_preference: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, // add to object
    category: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Job Category
    project_type: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Project Type
    project_length: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Project Length
    payment_type: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Payment Type
    //payment options
    payment_scheme: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    }, //Filter: Payment Scheme
    payment_range_lower: {
      type: 'integer'
    }, //Filter: Payment Range Lower
    payment_range_higher: {
      type: 'integer'
    }, //Filter: Payment Range Higher
    //Equity / tokens

    organization: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    organization_type: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    organization_size: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
    organization_preferences: {
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
    kind: {
      type: 'keyword',
      normalizer: 'case_insensitive_normalizer'
    },
  }
}

function transformer(document) {
  return {
    id: document.id,

    title: document.title,
    description: document.description,
    other_party_title: document.other_party_title,
    other_party_url: document.other_party_url,

    causes_tags: document.causes_tags,
    skills: document.causes_tags,
    city: document.city,
    country: document.country,
    timezone: document.timezone,
    remote_preference: document.remote_preference,
    category: document.job_category_id,
    project_type: document.project_type,
    project_length: document.project_length,
    payment_type: document.payment_type,
    //payment options
    payment_scheme: document.payment_scheme,
    payment_range_lower: document.payment_range_lower,
    payment_range_higher: document.payment_range_higher,
    //Equity / tokens
    organization: document.organization?.id,
    organization_type: document.organization?.type,
    organization_size: document.organization?.size,
    organization_preferences: document.preferences.map((preference) => {
      return {
        ...preference,
        title_value: `${preference.title}:${preference.value}`
      }
    }),
    kind: document.kind
  }
}

const indexing = async ({ id }) => {
  let document;
  const indexingDocuments = []

  try{
    const project = await app.db.get(
      sql`
      SELECT p.*, row_to_json(o.*) as organization, gn.timezone,
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
      FROM projects p
      LEFT JOIN geonames gn ON gn.id=p.geoname_id
      LEFT JOIN organizations o ON o.id=p.identity_id
      WHERE p.id=${id}
      `
    )
    document = transformer(project)
    indexingDocuments.push(app.searchClient.indexDocument(index, document.id, document))
  }catch(e){
    indexingDocuments.push(app.searchClient.deleteDocument(index, id))
  } 

  try {
    return await Promise.all(indexingDocuments)
  } catch (e) {
    console.log(e)
  }
}

async function getAllProjects({ offset = 0, limit = 100 }) {
  const { rows } = await app.db.query(
    sql`
    SELECT p.*, row_to_json(o.*) as organization, gn.timezone,
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
    FROM projects p
    LEFT JOIN geonames gn ON gn.id=p.geoname_id
    LEFT JOIN organizations o ON o.id=p.identity_id
    WHERE p.status='ACTIVE'
    LIMIT ${limit} OFFSET ${offset}
    `
  )

  return rows
}

const initIndexing = async () => {
  let offset = 0,
    limit = 10000,
    count = 0,
    projects = []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    projects = await getAllProjects({ limit, offset })
    if (projects.length < 1) break
    await app.searchClient.bulkIndexDocuments(index, projects.map(transformer))
    count += projects.length
    offset += limit
  }

  return { count }
}

export default {
  indices,
  indexing,
  initIndexing
}
