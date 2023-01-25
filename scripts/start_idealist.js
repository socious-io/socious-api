import { start } from '../src/services/idealist/index.js'
import {
  checkIdealist,
  verifyExists
} from '../src/services/idealist/check_active.js'

switch (process.argv[2]) {
  case '--check':
    checkIdealist()
    break
  case '--verify':
    verifyExists()
    break
  default:
    start()
}
