import Config from '../../config.js';
import {insert} from './webhooks.js';
import sql from 'sql-template-tag';
import {app} from '../../index.js';
import ImpactPoints from '../impact_points/index.js';
import {BadRequestError} from '../../utils/errors.js';

const partyName = 'PROOFSPACE';

export const proofSpaceClaim = async (body) => {
  await insert(partyName, body);

  const fields = body.receivedCredentials[0]?.fields;
  let userId;
  for (const f of fields) if (f.name === 'Socious User ID') userId = f.value;

  if (!userId) throw BadRequestError('Socious User ID not found');

  const user = await addUserConnectDid(userId);

  const records = await ImpactPoints.history(user.id, {offset: 0, limit: 100});

  const issues = records.map((r) => {
    return {
      credentialId: Config.services.proofspace.credentialId,
      schemaId: Config.services.proofspace.schemaId,
      fields: [
        {
          name: 'Organisation',
          value: r.organization.name || r.organization.shortname,
        },
        {name: 'Type of Mission', value: r.social_cause_category},
        {name: 'Start Date', value: r.mission.created_at.split('T')[0]},
        {name: 'End Date', value: r.created_at.toISOString().split('T')[0]},
        {name: 'Impact Points Earned', value: `${r.total_points}`},
        {name: 'Cumulative Impact Points', value: `${user.impact_points}`},
      ],
      utcIssuedAt: r.created_at.getTime(),
      revoked: false,
    };
  });

  return {
    serviceDid: body.serviceDid,
    subscriberConnectDid: body.subscriberConnectDid,
    actionEventId: body.actionEventId,
    issuedCredentials: issues,
    revokedCredentials: [], // can be kept as an empty array
  };
};

const addUserConnectDid = async (userId, connectId) => {
  try {
    const {rows} = await app.db.query(sql`
      UPDATE users SET 
        proofspace_connect_id=${connectId} 
      WHERE id=${userId}
      RETURNING id, impact_points
    `);
    return rows[0];
  } catch {
    throw BadRequestError(`User ${userId} not found`);
  }
};
