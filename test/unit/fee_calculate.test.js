import { app } from '../../src/index.js'
import { amounts } from '../../src/services/payments/index.js'

const data = [
  {
    amount: 5000,
    verfied: true,
    org_referred: null,
    user_referred: null,
    expect_total: 5283.6,
    expect_app_fee: 350,
    expect_stripe_fee: 183.6,
    expect_payout: 4750,
    service: 'STRIPE'
  },
  {
    amount: 5000,
    verfied: true,
    org_referred: null,
    user_referred: null,
    round: 1,
    expect_total: 5284,
    expect_app_fee: 350,
    expect_stripe_fee: 183.6,
    expect_payout: 4750,
    service: 'STRIPE'
  },
  {
    amount: 347.2,
    verfied: true,
    org_referred: null,
    user_referred: null,
    round: 100000,
    expect_total: 354.144,
    expect_app_fee: 24.304,
    expect_stripe_fee: 0,
    expect_payout: 329.84,
    service: 'CRYPTO'
  },
  {
    amount: 0.01,
    verfied: true,
    org_referred: null,
    user_referred: null,
    round: 100000,
    expect_total: 0.01021,
    expect_app_fee: 0.0007,
    expect_stripe_fee: 0,
    expect_payout: 0.0095,
    service: 'CRYPTO'
  },
  {
    amount: 1000,
    verfied: true,
    org_referred: '0x1111111111111111111111111111111111111111',
    user_referred: '0x1111111111111111111111111111111111111111',
    round: 100000,
    org_fee_discount: true,
    user_fee_discount: true,
    expect_total: 1010,
    expect_app_fee: 35,
    expect_stripe_fee: 0,
    expect_payout: 975,
    service: 'CRYPTO'
  },
  {
    amount: 1000,
    verfied: true,
    org_referred: '0x1111111111111111111111111111111111111111',
    org_fee_discount: true,
    user_referred: null,
    round: 100000,
    expect_total: 1010,
    expect_app_fee: 60,
    expect_stripe_fee: 0,
    expect_payout: 950,
    service: 'CRYPTO'
  },
  {
    amount: 1000,
    verfied: true,
    org_referred: null,
    user_referred: '0x1111111111111111111111111111111111111111',
    user_fee_discount: true,
    round: 100000,
    expect_total: 1020,
    expect_app_fee: 45,
    expect_stripe_fee: 0,
    expect_payout: 975,
    service: 'CRYPTO'
  }
]

beforeAll(async () => {
  app.listen()
})

test('calculate fee', async () => {
  for (const i of data) {
    const amount = amounts({
      amount: i.amount,
      service: i.service,
      verified: i.verfied,
      org_referred: i.org_referred,
      user_referred: i.user_referred,
      round: i.round,
      user_fee_discount: i.user_fee_discount,
      org_fee_discount: i.org_fee_discount
    })
    expect(amount.total).toBe(i.expect_total)
    expect(amount.app_fee).toBe(i.expect_app_fee)
    expect(amount.stripe_fee).toBe(i.expect_stripe_fee)
    expect(amount.payout).toBe(i.expect_payout)
  }
})
