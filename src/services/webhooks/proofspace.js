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
        Organisation: 'test',
        'Type of Mission': 'HEALTH',
        'Start Date': '2023-01-07',
        'End Date': '2023-01-16',
        'Impact Points Earned': 100,
        'Cumulative Impact Points': 100,
      },
    ],
    revokedCredentials: [], // can be kept as an empty array
  };
};
