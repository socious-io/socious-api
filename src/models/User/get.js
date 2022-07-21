import {app} from '../../index.js';


export const get = async (username) => {
  return app.db.execute('user/get', [username])
}
