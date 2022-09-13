import axios from 'axios';
import https from 'https';

let instance;

instance = function (context) {
  if (!instance) {
    //create axios instance
    instance = axios.create({
      //baseURL: domain,
      timeout: 60000, //optional
      httpsAgent: new https.Agent({keepAlive: true}),
      headers: {'Content-Type': 'application/json'},
    });
  }

  //return instance;
};

export default instance;
