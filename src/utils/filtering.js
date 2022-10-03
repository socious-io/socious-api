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
      return `'{${value.join(',')}}'`;
    default:
      return value;
  }
};

export const filtering = (filter, columns) => {
  if (!filter) return '';

  const conditions = [];

  for (const [key, val] of Object.entries(filter)) {
    if (!columns.includes(key))
      throw new BadRequestError('filter key not allowed');

    const valueKeys = Object.keys(val);

    let op = operators[valueKeys[0]];

    const value = op ? val[valueKeys[0]] : val;

    if (Array.isArray(value)) op = '@>';

    if (!op) op = '=';

    conditions.push(`${key} ${op} ${format(value)}`);
  }

  return conditions.join(' AND ');
};
