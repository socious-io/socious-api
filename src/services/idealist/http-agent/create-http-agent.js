import Agent from 'agentkeepalive';

export function createHttpAgent() {
  return new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000,
  });
}

export function createHttpsAgent() {
  return new Agent.HttpsAgent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000,
  });
}
