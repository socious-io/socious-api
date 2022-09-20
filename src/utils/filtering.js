import { BadRequestError } from "./errors.js"

const operators = {
  'eq': '=',
  'ne': '<>',
  'gt': '>',
  'gte': '>=',
  'lt': '<',
  'lte': '<='
}

export const format = (value) => typeof value === 'string' ? `'${value}'` : value

export const filtering = (filter, columns) => {

  if (!filter) return ''

  const conditions = []
  
  for (const [key, value] of Object.entries(filter)) {
    if (!columns.includes(key)) throw new BadRequestError('filter key not allowed')

    if (typeof value !== 'object') {
      conditions.push(`${key}=${format(value)}`)
      continue
    }

    const valueKeys = Object.keys(value)
    
    if (valueKeys.length < 1) continue
    
    const op = valueKeys[0]
    
    if (!Object.keys(operators).includes(op)) throw new BadRequestError(`${op} in not correct operator`)


    conditions.push(`${key}${operators[op]}${format(value[op])}`)

  }

  return conditions.join(' AND')
}
