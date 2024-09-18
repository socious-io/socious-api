import Data from '@socious/data'
import { BadRequestError } from '../../utils/errors.js'
import client from './client.js'

export const search = async (body, pagination) => {
  const typeToIndex = {
      users: 'users',
      projects: 'jobs',
      organizations: 'organizations'
    },
    { q, type, filter } = body,
    index = typeToIndex[type] + '_dev'

  if (!index) throw new BadRequestError(`type '${type}' is not valid`)
  await Data.SearchSchema.validateAsync(body)

  //make filters elastic-complient
  const filters = []
  for (const [key, value] of Object.entries(filter)) {
    const tempFilter = {}

    if (typeof value == 'string') {
      tempFilter.term = {
        [key]: value
      }
    } else if (Array.isArray(value)) {
      tempFilter.terms = {
        [key]: value
      }
    } else if (typeof value == 'object') {
      const [op, opValue] = Object.entries(value)[0]
      tempFilter.range = {
        [key]: {
          [op]: opValue
        }
      }
    }
    filters.push(tempFilter)
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
          query: q.trim()
        }
      }
    ]

  const { count, results } = await client.searchDocuments(index, queryDsl, { pagination })
  results.forEach((result) => (result.total_count = count.value))
  return results
}
