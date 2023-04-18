import axios from 'axios'
import Data from '@socious/data'
import { create, setCompleteTrx } from './transaction.js'
import config from '../../config.js'
import { ValidationError } from '../../utils/errors.js'
import { delay } from '../../utils/tools.js'
import logger from '../../utils/logging.js'

/**
 * @param {string} txHash
 * @param {string} src
 * @param {string} dest
 * @param {number} amount
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export const confirmTx = async (src, dest, amount, txHash, token, retry = 0) => {
  const network = config.crypto.networks.filter((n) => n.tokens?.indexOf(token) !== -1)[0]

  if (!network) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,
        dest,
        amount,
        txHash,
        token
      })}, RESULT => Network not found on ${JSON.stringify(config.crypto.networks)}`
    )
    return false
  }

  const data = {
    module: 'account',
    action: 'tokentx',
    sort: 'desc',
    address: src,
    apikey: network.explorer_api_key
  }

  const response = await axios.get(network.explorer, { params: data })

  if (response.data.status === '0') {
    logger.error(
      `CONFIRM CRYPTO => DATA ${JSON.stringify({
        src,
        dest,
        amount,
        txHash,
        token
      })}, PARAMS => ${JSON.stringify(data)} , RESULT =>  faild status `
    )
    return false
  }

  const tx = response.data.result.filter((r) => r.hash === txHash)[0]

  if (!tx && retry < 8) {
    await delay(500)
    retry++
    return await confirmTx(src, dest, amount, txHash, token, retry)
  }

  if (!tx) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,
        dest,
        amount,
        txHash,
        token
      })}, , PARAMS => ${JSON.stringify(data)}, RESULT => tx not found, TX => ${JSON.stringify(tx)}`
    )
    return false
  }

  // TODO verify amount
  const txAmount = parseInt(tx.value.slice(0, tx.value.length - 16)) / 100

  if (amount >= txAmount) return false

  if (tx.to.toUpperCase() !== dest.toUpperCase()) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,
        dest,
        amount,
        txHash,
        token
      })}, , PARAMS => ${JSON.stringify(data)}, RESULT => Wrong contract address, TX => ${JSON.stringify(tx)}`
    )
    return false
  }

  if (parseInt(tx.confirmations) < 10 && retry < 8) {
    await delay(500)
    retry++
    return await confirmTx(src, dest, amount, txHash, token, retry)
  }

  if (parseInt(tx.confirmations) < 10) return false

  return true
}

export const charge = async (identityId, { amount, currency, meta, source, txHash }) => {
  const network = config.crypto.networks.filter((n) => n.tokens?.indexOf(meta.token) !== -1)[0]

  const confirmed = await confirmTx(source, network.escrow.address, amount, txHash, meta.token)

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
