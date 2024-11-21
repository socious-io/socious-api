import config from '../../config.js'

export function normalizeIndexName(index){
  return config.env == 'production' ? index : index + '_dev'
}
