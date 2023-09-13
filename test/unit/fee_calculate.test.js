import { app } from '../../src/index.js'
import { amounts } from '../../src/services/payments/index.js'

const data = [
  {
    amount: 5000,
    verfied: true,
    expect_total: 5283.6,
    expect_app_fee: 350,
    expect_stripe_fee: 183.6,
    expect_payout: 4750
  },
  {
    amount: 5000,
    verfied: true,
    round: 1,
    expect_total: 5284,
    expect_app_fee: 350,
    expect_stripe_fee: 183.6,
    expect_payout: 4750
  }
]

beforeAll(async () => {
  app.listen()
})

test('calculate fee', async () => {
  const service = 'STRIPE'

  for (const i of data) {
    const amount = amounts({
      amount: i.amount,
      service,
      verified: i.verfied,
      round: i.round
    })
    expect(amount.total).toBe(i.expect_total)
    expect(amount.app_fee).toBe(i.expect_app_fee)
    expect(amount.stripe_fee).toBe(i.expect_stripe_fee)
    expect(amount.payout).toBe(i.expect_payout)
  }
})
