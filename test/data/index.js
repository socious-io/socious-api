import fs from 'fs/promises'

const data = {
  users: JSON.parse((await fs.readFile('./test/data/users.json')).toString()),
  orgs: JSON.parse((await fs.readFile('./test/data/organizations.json')).toString()),
  projects: JSON.parse((await fs.readFile('./test/data/projects.json')).toString()),
  posts: JSON.parse((await fs.readFile('./test/data/posts.json')).toString()),
  medias: JSON.parse((await fs.readFile('./test/data/medias.json')).toString()),
  disputes: JSON.parse((await fs.readFile('./test/data/disputes.json')).toString())
}

export default data
