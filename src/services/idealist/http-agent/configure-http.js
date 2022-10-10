import axios from 'axios';
import {createHttpAgent, createHttpsAgent} from './create-http-agent.js';

export function configureHttp() {
  axios.defaults.httpAgent = createHttpAgent();
  axios.defaults.httpsAgent = createHttpsAgent();
  console.log('Axios agentkeepalive running...');
}
