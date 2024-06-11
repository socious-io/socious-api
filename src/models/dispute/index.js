import * as write from './write.js'
import * as read from './read.js'
import * as constants from './constants.js'

export default {
  ...read,
  ...write,
  ...constants
}
