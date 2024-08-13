import publish from '../jobs/publish.js'

export const indexUsers = ({ id }) => {
  publish('index_users', { id })
}

export const indexJobs = ({ id }) => {
  publish('index_jobs', { id })
}

export const indexOrganizations = ({ id }) => {
  publish('index_organizations', { id })
}
