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
    await axios.post(URL, body, {headers: HEADERS});
  } catch (err) {
    logger.error(err);
  }
};
