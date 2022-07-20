import axios from 'axios';
import {circuitBreaker} from './axios-circuit-breaker';

export const xyzClient = axios.create({
  baseURL: process.env.XYZ_API_URL,
  headers: {
    'X-API-Key': process.env.XYZ_API_KEY,
  },
  validateStatus: (status) => status < 500,
  adapter: circuitBreaker(),
});
