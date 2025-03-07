import { BadRequestError } from '../../utils/errors.js'
import client from './client.js'

function getIndexByType(type) {
  const typeToIndex = {
    users: 'users',
    projects: 'projects',
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

function getFieldsBooleanFilterByType(type) {
  //AND by default
  const typeToFields = {
    users: {},
    projects: {
      project_type: 'OR',
      experience_level: 'OR',
      project_length: 'OR',
      payment_scheme: 'OR',
      organization: 'OR',
      organization_size: 'OR'
    },
    organizations: {
      id: 'OR',
      size: 'OR',
    },
    locations: {}
  }

  return typeToFields[type]
}

//make filters elastic-compliant
function generateFilters(filter, type) {
  let filters = []

  const fieldsBooleanFilter = getFieldsBooleanFilterByType(type)

  filter = filter ?? {}
  for (const [key, value] of Object.entries(filter)) {
    const isOrFilter = fieldsBooleanFilter[key] == 'OR'

    if (typeof value == 'string') {
      if(!value || value.length<1) continue;
      filters.push({
        terms: {
          [key]: [value]
        }
      })
    } else if (Array.isArray(value)) {
      if (value.length<1) continue;
      if (isOrFilter){
        filters.push({
          terms: {
            [key]: value
          }
        })
      }else {
        filters = [
          ...filters,
          ...value.map(v=>{return {
            terms: {
              [key]: [v]
            }
          }})
        ]
      }
      
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

function applyDefaultSorts(sort, type) {
  //Handle ascending sort on projects by default
  if (type=='projects'){
    sort.updated_at = sort.updated_at??'desc'
  }

  return sort
}

//make sort elastic-compliant
function generateSorts(sort, type) {
  let sorts = [
    {
      _score: "desc"
    }
  ]

  sort = sort ?? {}
  applyDefaultSorts(sort, type)

  if (sort) {
    for (const [sortKey, sortValue] of Object.entries(sort)) {
      //export type sortValue :SortOrder = 'asc' | 'desc';
      // @ts-ignore
      sorts.push({
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
  const filters = generateFilters(filter, type)
  const sorts = generateSorts(sort, type)

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
