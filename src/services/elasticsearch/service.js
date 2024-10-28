import Data from '@socious/data'
import { BadRequestError } from '../../utils/errors.js'
import client from './client.js'

export const search = async (body, pagination) => {
  let typeToIndex = {
      users: 'users',
      projects: 'jobs',
      organizations: 'organizations'
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
      ]
    },
    { q, type, filter } = body,
    index = typeToIndex[type] + '_dev',
    fields = typeToFields[type]

  if (!index) throw new BadRequestError(`type '${type}' is not valid`)
  await Data.SearchSchema.validateAsync(body)

  //make filters elastic-compliant
  let filters = []
  filter = filter ?? {}
  for (const [key, value] of Object.entries(filter)) {
    const tempFilter = {}

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

  return await client.searchDocuments(index, queryDsl, { pagination })
}
