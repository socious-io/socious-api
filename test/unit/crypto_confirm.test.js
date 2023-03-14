import Data from '@socious/data'
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
      '0xcfeac80cc43aa4aaa1d81d61e58f3846b139271d0fe5b75c4ecf5cb57e5202ef'
    )
  ).toBe(true)
})
