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
      '0x18Adf002AE3a67089E67B5765DaB67Be01C7b5ee',
      2.06,
      '0x12c9276cd4829867c85ebf3f8e815e2734fb6351fa8e86face453230fc41d1a6',
      '0x95cEc3b0a113AEf23eaFA4eD1B48489806bF6C82',
    )
  ).toBe(true) */
  /* expect(
    await confirmTx(
      '0x6990bf996e984cffde6ebcab6ac8723c95069719',
      8,
      '0xce6fd735b590b8dd254eb6eea2c75a047893b9ac9f3d5fd8d123b56a21e843ad',
      '0x95cEc3b0a113AEf23eaFA4eD1B48489806bF6C82',
      0,
      'testnet'
    )
  ).toBe(false) */

  expect(
    await confirmTx(
      '0xe94ee2beebe7a57bef523e12d434b72e086ab8c8',
      5.15,
      '0x10fdd6c550f3d9ff94746a606426823224c6f21c92cd8c76cce4fd816d7251b4',
      '0xC12F6Ee5c853393105f29EF0310e61e6B494a70F',
      0,
      'testnet'
    )
  ).toBe(true)

  expect(
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
  ).toBe(true)
})
