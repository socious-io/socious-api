import countries from 'i18n-iso-countries';

export function iso3ToIso2(iso3) {
  return new Promise((resolve, reject) => {
    const res = countries.alpha3ToAlpha2(iso3.toUpperCase());
    console.log(`Iso3 in promise is: ${res}`);
    resolve(res);
  });
}
