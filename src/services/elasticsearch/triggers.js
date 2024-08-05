import publish from '../jobs/publish.js'

export const userUpdate = ({document}) => {
  publish('index_document', { type: 'user_update', document })
}
