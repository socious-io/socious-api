import * as read from './read.js'
import * as write from './write.js'
import * as feedback from './feedback.js'

export default {
  ...read,
  ...write,
  ...feedback
}
