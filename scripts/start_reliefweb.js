import { listProjects, verifyExists } from '../src/services/reliefweb/controller.js'

switch (process.argv[2]) {
  case '--verify':
    verifyExists().then(() => process.exit(0))
    break
  default:
    listProjects().then(() => process.exit(0))
}
