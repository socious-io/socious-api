import * as write from './write.js'
import * as read from './read.js'
import * as settings from './settings.js'
import Data from '@socious/data'

export default {
  Types: Data.NotificationType,
  ...read,
  ...write,
  ...settings
}
