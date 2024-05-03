import * as write from './write.js'
import * as read from './read.js'
import * as questions from './questions.js'
import * as marks from './marks.js'

export default {
  ...read,
  ...write,
  ...questions,
  ...marks
}
