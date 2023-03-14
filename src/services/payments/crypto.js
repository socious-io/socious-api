import axios from 'axios'
import Data from '@socious/data'
import { create, setCompleteTrx } from './transaction.js'
import config from '../../config.js'
import { ValidationError } from '../../utils/errors.js'
import { delay } from '../../utils/tools.js'

/**
 * @param {string} txHash
 * @param {string} src
 * @param {string} dest
 * @param {number} amount
 * @returns {Promise<boolean>}
 */
export const confirmTx = async (src, dest, amount, txHash) => {
  const data = {
    module: 'account',
    action: 'tokentx',
    sort: 'desc',
    address: src
  }

  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const response = await axios.post(config.blockchain.explorer, data, options)

  const tx = response.data.result?.filter((r) => r.hash === txHash)[0]

  if (!tx) return false

  // TODO verify amount
  const txAmount = parseInt(tx.value.slice(0, tx.value.length - 16)) / 100

  if (amount >= txAmount) return false

  if (tx.to.toString().toUpperCase() !== dest.toUpperCase()) return false

  if (parseInt(tx.confirmations) < 10) {
    await delay(500)
    return await confirmTx(src, dest, amount, txHash)
  }

  return true
}

export const charge = async (identityId, { amount, currency, meta, source, txHash }) => {
  const confirmed = await confirmTx(source, config.blockchain.escrow.address, amount, txHash)

  if (!confirmed) throw new ValidationError('transaction is not valid')

  const trx = await create({
    identityId,
    amount,
    currency,
    service: Data.PaymentService.STRIPE,
    meta,
    source: source
  })

  await setCompleteTrx(trx.id, txHash)

  return {
    id: trx.id,
    amount: trx.amount,
    currency: trx.currency
  }
}
