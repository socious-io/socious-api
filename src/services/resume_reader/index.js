import { BadRequestError } from '../../utils/errors.js'
import Linkdin from './linkdin.js'
import * as model from './model.js'
import { apply } from './importer.js'

const read = async ({ identity_id, body, type }) => {
  if (type === 'LINKDIN'){
    const parsed = await Linkdin(body)
    return await model.insert(identity_id, { body: parsed, type })
  }
  
  throw new BadRequestError('could not match to type to parse')
}

export default {
  read,
  apply
}
