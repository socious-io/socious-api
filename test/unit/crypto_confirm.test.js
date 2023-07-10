import { app } from '../../src/index.js'
import { confirmTx } from '../../src/services/payments/crypto.js'

beforeAll(async () => {
  app.listen()
})

test('calculate', async () => {
  expect(
    await confirmTx(
      '0x6990bf996e984cffde6ebcab6ac8723c95069719',
      2,
      '0x6b6ba324635d0fb6617c8521a1851cd30ec168386960e433e0160e0e404af53d',
      '0x95cEc3b0a113AEf23eaFA4eD1B48489806bF6C82',
    )
  ).toBe(true)
  expect(
    await confirmTx(
      '0x6990bf996e984cffde6ebcab6ac8723c95069719',
      4,
      '0xce6fd735b590b8dd254eb6eea2c75a047893b9ac9f3d5fd8d123b56a21e843ad',
      '0x95cEc3b0a113AEf23eaFA4eD1B48489806bF6C82',
    )
  ).toBe(true)
  expect(
    await confirmTx(
      '0x6990bf996e984cffde6ebcab6ac8723c95069719',
      8,
      '0xce6fd735b590b8dd254eb6eea2c75a047893b9ac9f3d5fd8d123b56a21e843ad',
      '0x95cEc3b0a113AEf23eaFA4eD1B48489806bF6C82',
    )
  ).toBe(false)
})
