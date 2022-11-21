import {Reader} from '@maxmind/geoip2-node';
import config from '../../config.js';

const reader = await Reader.open(config.geoipDb).catch((_e) => null);

// make life easier for development
const local = ['192.168.0.1', '::1'];

export async function geoip(ip) {
  if (reader === null) return {};

  if (local.includes(ip)) ip = '91.234.192.9';

  let geo;
  try {
    geo = reader.city(ip);
  } catch (e) {
    console.error(e);
    return {error: 'not matched'};
  }
  if (geo?.country == null) return {error: 'not matched'};

  const resp = {
    id: geo.city?.geonameId,
    country: geo.country.isoCode,
    region: geo.region,
    city: geo.city?.names.en,
    eu: geo.country.isInEuropeanUnion,
    timezone: geo.location?.timezone,
  };
  if (geo.subdivisions?.length) {
    resp.admin1_code = geo.subdivisions[0].isoCode;
    resp.admin1_id = geo.subdivisions[0].geonameId;
    resp.admin1_name = geo.subdivisions[0].names.en;
    if (geo.subdivisions?.length > 1) {
      resp.admin2_code = geo.subdivisions[1].isoCode;
      resp.admin2_id = geo.subdivisions[1].geonameId;
      resp.admin2_name = geo.subdivisions[1].names.en;
    }
  }
  return resp;
}
