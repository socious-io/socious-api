import sql, {raw, join} from 'sql-template-tag';
import {BadRequestError} from './errors.js';

export const operators = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

export const filtering = (filter, columns, append = true) => {
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


  if (append) return join([raw(' AND '), result], '');

  return join([raw(' WHERE '), result], '');
};

export const sorting = (sort, columns) => {
  if (!sort) return raw(`ORDER BY ${columns[0]} DESC`);
}


export const textSearch = (q) => {
  const queryList = q.match(/\w+/g) 

  return queryList.map(i => `${i}:*`).join('&')
}
