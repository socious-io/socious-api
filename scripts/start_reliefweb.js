import {
  listProjects,
  verifyExists,
} from '../src/services/reliefweb/controller.js';

switch (process.argv[2]) {
  case '--verify':
    verifyExists();
    break;
  default:
    listProjects();
}
