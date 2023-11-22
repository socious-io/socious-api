import { app } from '../../src/index.js'
import { confirmTx } from '../../src/services/payments/crypto.js'

beforeAll(async () => {
  app.listen()
})

test('calculate', async () => {
  // new contract deployed need to collect new transaction these are not valid anymore
  /* expect(
    await confirmTx(
      '0x6990bf996e984cffde6ebcab6ac8723c95069719',
      1.03,
      '0x84c2e79b70376864afb6647bd46ad2c21ebe79e3129205e5d4a3b409d533d46e',
      '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9',
      0,
      'mainet'
    )
  ).toBe(true)
  expect(
    await confirmTx(
      '0xc4a877840a7ccad2e6763f9b1722a415134f2b22',
      1.02,
      '0x861d265ed37caf4953dfeab5a89284172e533db24fe5bba51fbe2976d102b52a',
      '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9',
      0,
      'mainet'
    )
  ).toBe(true) */
  /* expect(
    await confirmTronTx(
      'TB1NFFBYtL6YLsSv3phSmLXiDPriGGnEdZ',
      1,
      '5450a103b432ad000fd979a2d5b2aed123cbafe4258110b209907bb972726103',
      'TE9yud6CgmChFHsCNHTe9ui5q6mfidZzrA',
      0,
      'testnet'
    )
  ).toBe(true) */
  /* expect(
    await confirmTx(
      '0xc4a877840a7ccad2e6763f9b1722a415134f2b22',
      354.144,
      '0x02062bd833a55e6b0b5b5030bf899e04f84bed168de5e9edcfae086319bd9a63',
      '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9',
      0,
      'mainet'
    )
  ).toBe(true) */
})
