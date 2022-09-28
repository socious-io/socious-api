import axios from 'axios';
import {configureHttp} from '../idealist/http-agent/configure-http.js';

import {getLastReliefWebProjectId, processProject} from './project.js';

const url = 'https://api.reliefweb.int/v1/jobs';
const appName = 'socious';

export async function listProjects() {
  configureHttp();

  let last_id = await getLastReliefWebProjectId();
  let next = true;
  let ttl = 10;
  let limit = 100; //up to 1000, defaults to 1000

  let url_params;

  let count = 0;
  try {
    while (ttl > 0 && next === true) {
      url_params =
        `?appName=${appName}&profile=full&limit=${limit}` +
        `&filter[field]=id&filter[value][from]=${last_id}&sort[]=id:asc`;

      const response = await axios
        .get(`${url}${url_params}`, {
          headers: {
            Accept: 'application/json',
          },
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
            throw new Error(
              `Error in response getting listings, ${error.response.status}`,
            );
            //console.log(error.response.headers);
          } else if (error.request) {
            throw new Error(
              `Error in request getting listings for, ${error.request}`,
            );
          } else {
            console.log(`Other error getting listing for, ${error.message}`);
          }
        });

      if (response.status === 200) {
        console.log('Projects found: ' + response.data.data.length);

        const data = response.data.data;

        if (!response.data.links?.next) {
          next = false;
        }

        if (data.length > 0) {
          //let last_record = data[data.length - 1];
          //last_id = last_record.id;
          last_id = data[data.length - 1].id;
        }

        for (let x = 0; x < data.length; x++) {
          if (await processProject(data[x].fields)) {
            count++;
          }
        }
      } else if (response.status < 500) {
        next = false;
        console.log(
          `Error while getting reliefweb projects: ${response.status}`,
        );
      } else {
        console.log(`Error getting reliefweb projects: ${response.status}`);
        console.log(response);
      }

      ttl--;
    }
    console.log(`${count} projects processed.`);
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
}
