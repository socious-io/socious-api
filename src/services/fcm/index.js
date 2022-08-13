import axios from 'axios';
import config from '../../config.js';

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
  const body = {
    ...options,
    registration_ids: tokens,
    notification,
    data,
  };
  try {
    await axios.post(URL, body, {headers: HEADERS});
  } catch (err) {
    console.log(err);
  }
};
