import {worker} from './worker.js';
import publish from '../jobs/publish.js';

const calculate = (mission) => {
  publish('calculate_impact_points', {mission});
};

export default {
  calculate,
  worker,
};
