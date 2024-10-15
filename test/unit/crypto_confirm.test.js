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
       '0xb7735a4b3e491d1be51b00c751b107b0797447bc7a2cde484e861f59fb79df20',
       '0x55d398326f99059fF775485246999027B3197955',
       0,
       'mainet'
     )
   ).toBe(true)
})
