import * as write from './write.js'
import * as read from './read.js'
import * as questions from './questions.js'

export default {
  ...read,
  ...write,
  ...questions
}
