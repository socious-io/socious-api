import { app } from '../../src/index.js'
import { confirmTx } from '../../src/services/payments/crypto.js'

beforeAll(async () => {
  app.listen()
})

test('calculate', async () => {
  expect(
    await confirmTx(
      '0x6990bf996E984cffde6EbCAb6AC8723c95069719',
      0.102,
      '0x17027f1ace8a044ce6aeafa62aafda1b2d40afa58815119a6677098ad68c89ce',
      '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9',
      0,
      'mainet'
    )
  ).toBe(true)

  expect(
    await confirmTx(
      '0x30cB9dCac6B2bc7f8289d262BCaAb28f86bc64ED',
      0.01021,
      '0x93de8307c192ee6c0b5495eac895cd508e04e08b6e806f9d570270d1007ef621',
      '0xC12F6Ee5c853393105f29EF0310e61e6B494a70F',
      0,
      'testnet'
    )
  ).toBe(true)
})
