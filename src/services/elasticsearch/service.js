import { BadRequestError } from '../../utils/errors.js'
import client from './client.js'

function getIndexByType(type) {
  const typeToIndex = {
    users: 'users',
    projects: 'jobs',
    organizations: 'organizations',
    locations: 'locations'
  }

  return typeToIndex[type]
}

function getFieldsByType(type) {
  const typeToFields = {
    users: ['first_name.text^4', 'last_name.text^3', 'username^2', 'email.text^1'],
    projects: ['title.text^2', 'description.text^1'],
    organizations: [
      'name.text^8',
      'description.text^7',
      'bio.text^6',
      'email.text^5',
      'shortname.text^4',
      'mission.text^3',
      'address.text^2',
      'phone.text^1'
    ],
    locations: ['name.text^3', 'asciiname.text^2', 'country_name.text^1']
  }

  return typeToFields[type]
}

//make filters elastic-compliant
function generateFilters(filter) {
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

  return filters
}

//make sort elastic-compliant
function generateSorts(sort) {
  let sorts = []
  if (sort) {
    for (const [sortKey, sortValue] of Object.entries(sort)) {
      //export type sortValue :SortOrder = 'asc' | 'desc';
      sort.push({
        [sortKey]: sortValue
      })
    }
  }

  return sorts
}

export const search = async (body, pagination) => {
  const { q, type, filter, sort } = body,
    index = getIndexByType(type),
    fields = getFieldsByType(type)

  if (!index) throw new BadRequestError(`type '${type}' is not valid`)

  //make sort elastic-compliant
  const filters = generateFilters(filter)
  const sorts = generateSorts(sort)

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

  return await client.searchDocuments(index, queryDsl, { pagination, sort: sorts })
}
