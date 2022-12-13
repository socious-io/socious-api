import Segment from 'analytics-node';
import config from '../../config.js';
import publish from '../jobs/publish.js';
import logger from '../../utils/logging.js';

const analytics = new Segment(config.segmentAnalytics);

const identify = ({userId, email, meta}) => {
  publish('analytics_identitfy', {userId, email, meta});
};

const track = ({userId, event, meta}) => {
  publish('analytics_track', {userId, event, meta});
};

const identifyWorker = async ({userId, email, meta}) => {
  try {
    analytics.identify({
      userId,
      traits: {
        ...meta,
        email,
      },
    });
  } catch (err) {
    logger.error(JSON.stringify(err));
  }
};

const trackWorker = async ({userId, event, meta}) => {
  try {
    analytics.track({
      userId,
      event,
      properties: meta,
    });
  } catch (err) {
    logger.error(JSON.stringify(err));
  }
};

export default {
  identify,
  identifyWorker,
  track,
  trackWorker,
};
