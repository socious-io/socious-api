import fs from 'fs/promises';

var data = {
  user: JSON.parse((await fs.readFile('./test/data/user.json')).toString()),
};

export default data;
