import axios from 'axios'
import Data from '@socious/data'
import { create, setCompleteTrx } from './transaction.js'
import config from '../../config.js'
import { ValidationError } from '../../utils/errors.js'
import { delay } from '../../utils/tools.js'
import logger from '../../utils/logging.js'

export const cryptoUSDRate = async (token) => {
  const convertor = config.crypto.usd_convertor[token]

  if (!convertor) return 1.0

  return convertor.rate
}

/**
 * @param {string} txHash
 * @param {string} src
 * @param {number} amount
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export const confirmTx = async (src, amount, txHash, token, retry = 0, env = undefined) => {
  const network = config.crypto.networks[env || config.crypto.env].filter((n) => {
    const t = n.tokens.filter((t) => t.address === token)[0]
    return t !== undefined
  })[0]

  if (!network) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,
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
    address: src
  }

  const response = await axios.get(network.chain.explorer, { params: data })

  if (response.data.status === '0') {
    logger.error(
      `CONFIRM CRYPTO => DATA ${JSON.stringify({
        src,
        amount,
        txHash,
        token
      })}, PARAMS => ${JSON.stringify(data)} , RESULT =>  faild status `
    )
    return false
  }

  const tx = response.data.result.filter((r) => r.hash === txHash)[0]

  if (!tx && retry < 8) {
    await delay(5000)
    retry++
    return await confirmTx(src, amount, txHash, token, retry, env)
  }

  if (!tx) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,

        amount,
        txHash,
        token
      })}, PARAMS => ${JSON.stringify(data)}, RESULT => tx not found, TX => ${JSON.stringify(
        response.data.result[0].hash
      )} != ${txHash}`
    )
    return false
  }

  const splited = amount.toString().split('.')
  const realLength = splited[0].length
  const decimalsLength = splited[1]?.length || 0

  let txAmount = parseInt(tx.value.slice(0, realLength + decimalsLength)) / Math.pow(10, decimalsLength)

  if (amount > txAmount) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,

        amount,
        txHash,
        token
      })}, PARAMS => ${JSON.stringify(data)}, RESULT => amount not match to offer ${amount} >= ${txAmount}`
    )
    return false
  }

  if (tx.to.toUpperCase() !== network.escrow.toUpperCase()) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,
        amount,
        txHash,
        token
      })}, , PARAMS => ${JSON.stringify(data)}, RESULT => Wrong contract address, TX => ${JSON.stringify(tx)}`
    )
    return false
  }

  if (parseInt(tx.confirmations) < 10 && retry < 8) {
    await delay(5000)
    retry++
    return await confirmTx(src, amount, txHash, token, retry, env)
  }

  if (parseInt(tx.confirmations) < 10) {
    `CONFIRM CRYPTODATA ${JSON.stringify({
      src,

      amount,
      txHash,
      token
    })}, PARAMS => ${JSON.stringify(data)}, RESULT => confirmation blocks after 5 second ${tx.confirmation} < 10`
    return false
  }

  return true
}

export const confirmTronTx = async (src, amount, txHash, token, retry = 0, env = undefined) => {
  const network = config.crypto.networks[env || config.crypto.env].filter((n) => {
    const t = n.tokens.filter((t) => t.address === token)[0]
    return t !== undefined
  })[0]

  if (!network) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,
        amount,
        txHash,
        token
      })}, RESULT => Network not found on ${JSON.stringify(config.crypto.networks)}`
    )
    return false
  }

  const response = await axios.get(`${network.chain.explorer}/accounts/${src}/transactions/trc20?only_confirmed=true`)

  if (response.status === 400) {
    logger.error(
      `CONFIRM CRYPTO => DATA ${JSON.stringify({
        src,
        amount,
        txHash,
        token
      })} , RESULT =>  faild to get address transactions `
    )
    return false
  }
  const tx = response.data.data.filter((r) => r.transaction_id === txHash)[0]

  if (!tx && retry < 8) {
    await delay(5000)
    retry++
    return await confirmTronTx(src, amount, txHash, token, retry, env)
  }

  if (!tx) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,

        amount,
        txHash,
        token
      })}, RESULT => tx not found, TX => ${JSON.stringify(response.data.result[0].hash)} != ${txHash}`
    )
    return false
  }

  const splited = amount.toString().split('.')
  const realLength = splited[0].length
  const decimalsLength = splited[1]?.length || 0

  let txAmount = parseInt(tx.value.slice(0, realLength + decimalsLength)) / Math.pow(10, decimalsLength)

  if (amount > txAmount) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,

        amount,
        txHash,
        token
      })}, RESULT => amount not match to offer ${amount} >= ${txAmount}`
    )
    return false
  }

  if (tx.to.toUpperCase() !== network.escrow.toUpperCase()) {
    logger.error(
      `CONFIRM CRYPTODATA ${JSON.stringify({
        src,
        amount,
        txHash,
        token
      })}, RESULT => Wrong contract address, TX => ${JSON.stringify(tx)}`
    )
    return false
  }

  return true
}

export const charge = async (identityId, { amount, currency, meta, source, txHash }) => {
  const network = config.crypto.networks[config.crypto.env].filter((n) => {
    const t = n.tokens.filter((t) => t.address === meta.token)[0]
    return t !== undefined
  })[0]

  if (!network) throw new ValidationError('could not find chain network')

  let confirmed = false

  if (network.chain.tron) {
    confirmed = await confirmTronTx(source, amount, txHash, meta.token)
  } else {
    confirmed = await confirmTx(source, amount, txHash, meta.token)
  }

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
