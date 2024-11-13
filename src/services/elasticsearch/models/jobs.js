import { app } from '../../../index.js'
import sql from 'sql-template-tag'

const index = 'jobs'
const indices = {
  index,
  fields: {
    //Full Text Search
    title: { type: 'text' },
    description: { type: 'text' },
    other_party_title: { type: 'text' },
    other_party_url: { type: 'text' },

    //Filters
    causes_tags: { type: 'keyword' }, //Filter: Social Causes
    skills: { type: 'keyword' }, //Filter: Skills
    city: { type: 'keyword' }, //Filter: Location
    country: { type: 'keyword' }, //Filter: Location
    timezone: { type: 'keyword' }, //Filter: Timezone
    remote_preference: { type: 'keyword' }, // add to object
    category: { type: 'keyword' }, //Filter: Job Category
    project_type: { type: 'keyword' }, //Filter: Project Type
    project_length: { type: 'keyword' }, //Filter: Project Length
    payment_type: { type: 'keyword' }, //Filter: Payment Type
    //payment options
    payment_scheme: { type: 'keyword' }, //Filter: Payment Scheme
    payment_range_lower: { type: 'integer' }, //Filter: Payment Range Lower
    payment_range_higher: { type: 'integer' }, //Filter: Payment Range Higher
    //Equity / tokens

    organization: { type: 'keyword' },
    organization_type: { type: 'keyword' },
    organization_size: { type: 'keyword' },
    organization_preferences: {
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
    organization: document.organization.id,
    organization_type: document.organization.type,
    organization_size: document.organization.size,
    organization_preferences: document.preferences.map((preference) => {
      return {
        ...preference,
        title_value: `${preference.title}:${preference.value}`
      }
    })
  }
}

const indexing = async ({ id }) => {
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
    JOIN organizations o ON o.id=p.identity_id
    WHERE p.id=${id}
    `
  )
  const document = transformer(project)

  const indexingDocuments = [app.searchClient.indexDocument(index, document.id, document)]
  try {
    return await Promise.all(indexingDocuments)
  } catch (e) {
    console.log(e)
  }
}

async function getAllJobs({ offset = 0, limit = 100 }) {
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
    JOIN organizations o ON o.id=p.identity_id
    WHERE p.status='ACTIVE'
    LIMIT ${limit} OFFSET ${offset}
    `
  )

  return rows
}

const initIndexing = async () => {
  let offset = 0,
    limit = 100,
    count = 0,
    projects = []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    projects = await getAllJobs({ limit, offset })
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
