import { BadRequestError } from '../../utils/errors.js'
import client from './client.js'

export const search = async (body, pagination) => {
  let typeToIndex = {
      users: 'users',
      projects: 'jobs',
      organizations: 'organizations',
      locations: 'locations'
    },
    typeToFields = {
      users: ['first_name^2', 'last_name^1'],
      projects: ['title^2', 'description^1'],
      organizations: [
        'name^9',
        'description^8',
        'bio^7',
        'email^6',
        'shortname^5',
        'mission^4',
        'address^3',
        'email^2',
        'phone^1'
      ],
      locations: ['name']
    },
    { q, type, filter } = body,
    index = typeToIndex[type],
    fields = typeToFields[type]

  if (!index) throw new BadRequestError(`type '${type}' is not valid`)

  //make filters elastic-compliant
  let filters = []
  filter = filter ?? {}
  for (const [key, value] of Object.entries(filter)) {
    if (typeof value == 'string') {
      filters.push({
        match_phrase: {
          [key]: value
        }
      })
    } else if (Array.isArray(value)) {
      const phrase_filters = []
      value.forEach((val) =>
        phrase_filters.push({
          match_phrase: {
            [key]: val
          }
        })
      )
      filters = [...filters, ...phrase_filters]
    } else if (typeof value == 'object') {
      const [op, opValue] = Object.entries(value)[0]
      filters.push({
        range: {
          [key]: {
            [op]: opValue
          }
        }
      })
    }
  }

  //make sort elastic-compliant
  let sort = []
  if (body.sort) {
    for (const [sortKey, sortValue] of Object.entries(body.sort)) {
      sort.push({
        [sortKey]: sortValue
      })
    }
  }

  //setting filter parameters
  const queryDsl = {
    bool: {
      filter: filters
    }
  }
  if (q)
    queryDsl.bool.must = [
      {
        query_string: {
          query: `*${q.trim()}*`,
          fields
        }
      }
    ]

  return await client.searchDocuments(index, queryDsl, { pagination, sort })
}
