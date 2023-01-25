import countries from 'i18n-iso-countries'

/**
 *
 * @param iso3
 * @example
 */
export function iso3ToIso2(iso3) {
  return new Promise((resolve) => {
    const res = countries.alpha3ToAlpha2(iso3.toUpperCase())
    resolve(res)
  })
}
