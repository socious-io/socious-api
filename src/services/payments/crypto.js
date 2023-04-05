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
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export const confirmTx = async (src, dest, amount, txHash, token) => {
  const network = config.crypto.networks.filter((n) => n.tokens.indexOf(token) !== -1)[0]

  if (!network) return false

  const data = {
    module: 'account',
    action: 'tokentx',
    sort: 'desc',
    address: src,
    apikey: network.explorer_api_key
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
    return await confirmTx(src, dest, amount, txHash, token)
  }

  return true
}

export const charge = async (identityId, { amount, currency, meta, source, txHash }) => {
  const confirmed = await confirmTx(source, config.blockchain.escrow.address, amount, txHash, meta.token)

  if (!confirmed) throw new ValidationError('transaction is not valid')

  const trx = await create({
    identity_id: identityId,
    amount,
    currency,
    service: Data.PaymentService.CRYPTO,
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
