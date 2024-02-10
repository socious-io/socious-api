import sql, { raw, join } from 'sql-template-tag'
import { BadRequestError } from './errors.js'

export const operators = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<='
}

export const filtering = (filter, columns, append = true, prefix = '') => {
  if (!filter || Object.keys(filter).length < 1) return raw('')

  if (prefix) prefix += '.'

  const conditions = []

  const columnsKeys = Object.keys(columns)

  for (const [key, val] of Object.entries(filter)) {
    if (!columnsKeys.includes(key)) {
      throw new BadRequestError('filter key not allowed')
    }

    if (val === undefined) continue
    if (val === null) {
      conditions.push(raw(`${key} IS NULL`))
      continue
    }

    let pre = prefix

    if (key.split('.').length > 1) pre = ''

    const valueKeys = Object.keys(val)

    const name = columns[key].as ?? `${pre}${key}`

    let op = operators[valueKeys[0]]

    let value = op ? val[valueKeys[0]] : val

    if (!Array.isArray(value)) {
      const splited = value.split(',')
      if (splited.length > 1) value = splited
    }

    if (columns[key] === Array || columns[key].type === Array) {
      value = `{${value}}`
      op = '@>'
    }

    if (Array.isArray(value)) op = ''

    if (!op) op = '='
    const operation = raw(`${name} ${op}`)

    if (Array.isArray(value)) {
      conditions.push(sql`${operation} ANY(${value})`)
    } else {
      conditions.push(sql`${operation} ${value}`)
    }
  }

  if (conditions.length < 1) return raw('')

  const result = join(conditions, ' AND ')

  if (append) return join([raw(' AND '), result], '')

  return join([raw(' WHERE '), result], '')
}

export const sorting = (sort, columns, prefix = '') => {
  if (prefix) prefix += '.'
  if (!sort) {
    const sortings = columns.map((c) => `${prefix}${c} DESC`).join(',')
    return raw(`ORDER BY ${sortings}`)
  }

  const dir = sort.startsWith('-') ? 'DESC' : 'ASC'

  sort = sort.replace('-', '').replace('+', '')
  return raw(`ORDER BY ${prefix}${sort} ${dir}`)
}

export const textSearch = (q) => {
  const queryList = q.match(/\w+/g)

  return queryList.map((i) => `${i}:*`).join('&')
}
