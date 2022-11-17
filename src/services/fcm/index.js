import axios from 'axios';
import config from '../../config.js';
import logger from '../../utils/logging.js';

const URL = 'https://fcm.googleapis.com/fcm/send';

const HEADERS = {
  Authorization: `key=${config.fcm.key}`,
};

export const simplePush = async ({
  tokens,
  notification,
  data = {},
  options = {},
}) => {
  if (tokens.length < 1) return;

  const body = {
    ...options,
    registration_ids: tokens,
    notification,
    data,
  };

  try {
    const response = await axios.post(URL, body, {headers: HEADERS});
    logger.info(JSON.stringify(body));
    logger.info(response.body || response.data);
  } catch (err) {
    logger.error(err);
  }
};
