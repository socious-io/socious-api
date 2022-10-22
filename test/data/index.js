import fs from 'fs/promises';

var data = {
  users: JSON.parse((await fs.readFile('./test/data/users.json')).toString()),
  orgs: JSON.parse(
    (await fs.readFile('./test/data/organizations.json')).toString(),
  ),
  projects: JSON.parse(
    (await fs.readFile('./test/data/projects.json')).toString(),
  ),
  posts: JSON.parse((await fs.readFile('./test/data/posts.json')).toString()),
};

export default data;
