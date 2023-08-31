import { app } from '../../src/index.js'
import { amounts } from '../../src/services/payments/index.js'

beforeAll(async () => {
  app.listen()
})

test('calculate fee', async () => {
  const service = 'STRIPE'

  expect(
    JSON.stringify(
      amounts({
        amount: 5000,
        service,
        verified: true
      })
    )
  ).toBe(
    JSON.stringify({
      amount: 5000,
      fee: 183.6,
      total: 5183.6,
      payout: 4750,
      app_fee: 433.6
    })
  )

  expect(
    JSON.stringify(
      amounts({
        amount: 5000,
        service,
        verified: false
      })
    )
  ).toBe(
    JSON.stringify({
      amount: 5000,
      fee: 185.39999999999998,
      total: 5185.4,
      payout: 4500,
      app_fee: 685.4
    })
  )
})
