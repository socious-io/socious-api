import {worker} from './worker.js';
import publish from '../jobs/publish.js';

const push = (mission) => {
  publish('calculate_impact_points', {mission});
};

export default {
  push,
  worker,
};
