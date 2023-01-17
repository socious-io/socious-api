import Config from '../../config.js';
import {insert} from './webhooks.js';

const partyName = 'PROOFSPACE';

export const proofSpaceClaim = async (body) => {
  await insert(partyName, body);
  return {
    serviceDid: body.serviceDid,
    subscriberConnectDid: body.subscriberConnectDid,
    actionEventId: body.actionEventId,
    issuedCredentials: [
      {
        credentialId: Config.services.proofspace.credentialId,
        schemaId: Config.services.proofspace.schemaId,
        fields: [
          {name: 'Organisation', value: 'test'},
          {name: 'Type of Mission', value: 'HEALTH'},
          {name: 'Start Date', value: '2023-01-07'},
          {name: 'End Date', value: '2023-01-16'},
          {name: 'Impact Points Earned', value: 100},
          {name: 'Cumulative Impact Points', value: 100},
        ],
        utcIssuedAt: new Date().getTime(),
        revoked: false,
      },
    ],
    revokedCredentials: [], // can be kept as an empty array
  };
};
