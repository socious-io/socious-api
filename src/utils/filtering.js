import sql, {raw, join} from 'sql-template-tag';
import {BadRequestError} from './errors.js';

const operators = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

export const format = (value) => {
  switch (typeof value) {
    case 'string':
      return `'${value}'`;
    case 'object':
      if (!Array.isArray(value))
        throw new BadRequestError(`filtering value is not valid`);
      return `''`;
    default:
      return value;
  }
};

export const filtering = (filter, columns, andPrefix = true) => {
  if (!filter) return raw('');

  const conditions = [];

  for (const [key, val] of Object.entries(filter)) {
    if (!columns.includes(key))
      throw new BadRequestError('filter key not allowed');

    if (!val) continue;

    const valueKeys = Object.keys(val);

    let op = operators[valueKeys[0]];

    const value = op ? val[valueKeys[0]] : val;

    if (Array.isArray(value)) op = '';

    if (!op) op = '=';
    const operation = raw(`${key} ${op}`)
    
    if (Array.isArray(value)) {
      conditions.push(sql`${operation} ANY(${value})`);
    } else {
      conditions.push(sql`${operation} ${value}`);
    }
  }

  let result = join(conditions, ' AND ');


  if (andPrefix) return join([raw(' AND '), result], '');

  return result
};

export const sorting = (filter) => {
}
