import Data from '@socious/data';
import {app} from '../../src/index.js';
import {calculate} from '../../src/services/impact_points/worker.js';

beforeAll(async () => {
  app.listen();
});

test('calculate', async () => {
  expect(
    calculate({
      categories: [{hourly_wage_dollars: 20}],
      total_hours: 2,
      payment_type: Data.ProjectPaymentType.VOLUNTEER,
      experience_level: 2,
    }),
  ).toBe(44);

  expect(
    calculate({
      categories: [{hourly_wage_dollars: 20}],
      total_hours: 2,
      payment_type: Data.ProjectPaymentType.PAID,
      experience_level: 2,
    }),
  ).toBe(4);

  expect(
    calculate({
      categories: [{hourly_wage_dollars: 25}],
      total_hours: 5,
      payment_type: Data.ProjectPaymentType.PAID,
      experience_level: 3,
    }),
  ).toBe(13.75);

  expect(
    calculate({
      categories: [{hourly_wage_dollars: 20}],
      total_hours: 180,
      payment_type: Data.ProjectPaymentType.VOLUNTEER,
      experience_level: 1,
    }),
  ).toBe(3564);
});
