import sql from 'sql-template-tag'
import { app } from '../../index.js'

export const experienceFilters = {
  status: String
}

export const getContributionStatus = (identityId) => {
  return app.db.get(sql`
    SELECT 
    c.*,
    row_to_json(i.*) AS contributor
    FROM contributors c
    JOIN identities i ON i.id=contributor_id
    WHERE contributor_id=${identityId}
  `)
}

export const getAllContributionInvitationsByType = async (identityId, type) => {
  const { rows } = await app.db.query(sql`
    SELECT id, status, type, created_at, updated_at
    FROM contribute_invitations ci
    WHERE contributor_id=${identityId} AND type=${type}
  `)
  return rows
}

export const getContributionInvitationById = (identityId, id) => {
  return app.db.get(sql`
    SELECT id, status, type, created_at, updated_at
    FROM contribute_invitations ci
    WHERE contributor_id=${identityId} AND id=${id}
  `)
}
