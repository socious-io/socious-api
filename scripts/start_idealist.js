import { start } from '../src/services/idealist/index.js'
import { checkIdealist, verifyExists } from '../src/services/idealist/check_active.js'

switch (process.argv[2]) {
  case '--check':
    checkIdealist().then(() => process.exit(0))
    break
  case '--verify':
    verifyExists().then(() => process.exit(0))
    break
  default:
    start().then(() => process.exit(0))
}
