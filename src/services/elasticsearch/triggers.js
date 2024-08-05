import publish from '../jobs/publish.js'

export const indexUsers = ({ document }) => {
  publish('index_users', { type: 'users', document })
}

export const indexJobs = ({ document }) => {
  publish('index_jobs', { type: 'jobs', document })
}

export const indexOrganizations = ({ document }) => {
  publish('index_organizations', { type: 'organizations', document })
}
