import sql from 'sql-template-tag'
import { EntryError } from '../../utils/errors.js'
import { app } from '../../index.js'

import { get } from './read.js'

export const insert = async ({ project_id, assignee_id, assigner_id, offer_id, applicant_id }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO missions (project_id, assignee_id, assigner_id, offer_id, applicant_id) VALUES (
      ${project_id},
      ${assignee_id},
      ${assigner_id},
      ${offer_id},
      ${applicant_id})
    RETURNING id
    `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const submitWork = async ({ mission_id, project_id, total_hours, start_at, end_at }) => {
  try {
    const { rows } = await app.db.query(sql`
    INSERT INTO submitted_works (project_id, mission_id, total_hours, start_at, end_at) 
    VALUES (${project_id}, ${mission_id}, ${total_hours}, ${start_at}, ${end_at})
    RETURNING *
    `)
    return get(rows[0].missin_id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const confirmWork = async (id) => {
  try {
    const { rows } = await app.db.query(sql`
      UPDATE submitted_works SET status='CONFIRMED' WHERE id=${id}
      RETURNING *
      `)
    return get(rows[0].mission_id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const complete = async (missionId) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE missions SET 
      status='COMPLETE', 
      complete_at=now(),
      updated_at=now()
    WHERE id=${missionId} AND status='ACTIVE'
    RETURNING id
    `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const confirm = async (missionId) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE missions SET 
      status='CONFIRMED',
      updated_at=now()
    WHERE id=${missionId} AND status='COMPLETE'
    RETURNING id
    `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const cancel = async (missionId) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE missions SET 
      status='CANCELED', 
      updated_at=now()
    WHERE id=${missionId} AND status='ACTIVE'
    RETURNING id
    `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}

export const kickout = async (missionId) => {
  try {
    const { rows } = await app.db.query(sql`
    UPDATE missions SET 
      status='KICKED_OUT', 
      updated_at=now()
    WHERE id=${missionId} AND status='ACTIVE'
    RETURNING id
    `)
    return get(rows[0].id)
  } catch (err) {
    throw new EntryError(err.message)
  }
}
