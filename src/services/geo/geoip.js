import fgeoip from 'fast-geoip';

export async function geoip(ip) {
  try {
    const geo = await fgeoip.lookup(ip);
    return {
      country: geo.country,
      region: geo.region,
      city: geo.city,
      eu: geo.eu,
      timezone: geo.timezone,
    };
  } catch (e) {
    console.error(e);
    return {error: 'not matched'};
  }
}
