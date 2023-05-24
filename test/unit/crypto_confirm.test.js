import { app } from '../../src/index.js'
import { confirmTx } from '../../src/services/payments/crypto.js'

beforeAll(async () => {
  app.listen()
})

test('calculate', async () => {
  expect(
    await confirmTx(
      '0x76afe00f901839cbc4df73b394916f39503283f3',
      '0xe18916C47704D6D4ED6195462f08d92FEd9D697a',
      2,
      '0xcfeac80cc43aa4aaa1d81d61e58f3846b139271d0fe5b75c4ecf5cb57e5202ef',
      '0x95cEc3b0a113AEf23eaFA4eD1B48489806bF6C82'
    )
  ).toBe(true)
  expect(
    await confirmTx(
      '0x18Adf002AE3a67089E67B5765DaB67Be01C7b5ee',
      '0xF35a012313Be8c7c3c48e86466fe3b8cd809a7b0',
      8.24,
      '0x92c693c41adc79bca9140b36c36f91fa5eb1ecbd6768526463fff1d0ee5b8a78',
      '0x95cEc3b0a113AEf23eaFA4eD1B48489806bF6C82'
    )
  ).toBe(true)
})
