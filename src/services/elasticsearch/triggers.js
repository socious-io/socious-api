import { app } from '../../index.js'
import publish from '../jobs/publish.js'

export const indexUsers = ({ id }) => {
  publish('index_users', { id })
}

export const indexProjects = ({ id }) => {
  publish('index_projects', { id })
}

export const indexOrganizations = ({ id }) => {
  publish('index_organizations', { id })
}

export const indexLocations = ({ id }) => {
  publish('index_locations', { id })
}
