import { app } from '../../src/index.js'
import { confirmTx } from '../../src/services/payments/crypto.js'

beforeAll(async () => {
  app.listen()
})

test('calculate', async () => {
  expect(
    await confirmTx(
      '0xc4A877840a7cCAD2E6763f9b1722a415134f2b22',
      2147.3651,
      '0xab43853a2f49099bbb9fcef63f22ebb03ce464743b06e0363842abbcac5a8687',
      '0x55d398326f99059fF775485246999027B3197955',
      0,
      'mainet'
    )
  ).toBe(true)
})
