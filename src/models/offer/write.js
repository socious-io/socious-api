import sql from 'sql-template-tag'
import { EntryError } from '../../utils/errors.js'
import Data from '@socious/data'
import { app } from '../../index.js'

import { get } from './read.js'

export const send = async (
  projectId,
  {
    applicant_id,
    recipient_id,
    offerer_id,
    offer_rate,
    offer_message,
    due_date,
    assignment_total,
    weekly_limit,
    total_hours,
    payment_mode,
    crypto_currency_address,
    currency
  }
) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO offers (
      project_id,
      applicant_id,
      recipient_id,
      offerer_id,
      offer_rate,
      offer_message,
      due_date,
      assignment_total,
      weekly_limit,
      total_hours,
      payment_mode,
      crypto_currency_address,
      currency
    ) VALUES (
      ${projectId},
      ${applicant_id},
      ${recipient_id},
      ${offerer_id},
      ${offer_rate},
      ${offer_message},
      ${due_date},
      ${assignment_total},
      ${weekly_limit},
      ${total_hours},
      ${payment_mode},
      ${crypto_currency_address},
      ${currency}
    ) RETURNING id
  `)

    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err)
  }
}

export const withdrawn = async (id) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE offers SET 
      status=${Data.OfferStatus.WITHDRAWN}
    WHERE 
      id=${id} AND 
      status NOT IN (${Data.OfferStatus.HIRED}, ${Data.OfferStatus.CLOSED}, ${Data.OfferStatus.CANCELED})
    RETURNING id
    `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const approve = async (id) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE offers SET 
      status=${Data.OfferStatus.APPROVED}
    WHERE 
      id=${id} AND 
      status=${Data.OfferStatus.PENDING}
    RETURNING id
  `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const cancel = async (id) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE offers SET 
      status=${Data.OfferStatus.CANCELED}
    WHERE 
      id=${id} AND 
      status NOT IN (${Data.OfferStatus.HIRED}, ${Data.OfferStatus.CLOSED}, ${Data.OfferStatus.CANCELED})
    RETURNING id
  `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const hire = async (id) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE offers SET 
      status=${Data.OfferStatus.HIRED}
    WHERE 
      id=${id} AND 
      status=${Data.OfferStatus.APPROVED}
    RETURNING id
  `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}
